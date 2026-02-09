import { createClient, createAccount } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import { parseDynamicJSON } from "./utils";

export const CONTRACT_ADDRESS = "0x16aBdCFb7834ab0660ecD9Eb2dAe320C54E79a31";
export const CUSTOM_CONTRACT_ADDRESS = "0x66E2647e951970b82383d5B4fAE8Ad8e3449EF75";

let client: any = null;

export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correct_option: string;
}

export interface QuizData {
  study_material: string;
  questions: QuizQuestion[];
}

export interface QuizResult {
  total_score: string;
  percentage: string;
  details: string[];
}


// Initialize GenLayer client (Kenny Pattern - Singleton)
export const initializeGenLayer = async () => {
  if (client) return client;

  const privateKey = import.meta.env.VITE_GENLAYER_KEY || "";
  if (!privateKey) {
    console.error("❌ Missing VITE_GENLAYER_KEY in environment");
    return null;
  }

  try {
    const account = createAccount(privateKey);
    client = createClient({ chain: studionet, account });

    await client.initializeConsensusSmartContract();
    console.log("✅ Consensus initialized");

    return client;
  } catch (e) {
    console.error("❌ Initialization error:", e);
    return null;
  }
};

// Generate quiz from contract
export const generateQuiz = async (
  topic: string,
  difficulty: string,
  onProgress?: (status: string) => void
): Promise<QuizData | null> => {
  try {
    const activeClient = await initializeGenLayer();
    if (!activeClient) {
      onProgress?.("❌ Failed to initialize GenLayer");
      return null;
    }

    onProgress?.("⚠️ Generating quiz... This may take 1-2 minutes.");

    const hash = await activeClient.writeContract({
      address: CONTRACT_ADDRESS,
      functionName: "generate_quiz",
      args: [topic, difficulty],
    });

    console.log("✅ Transaction sent! Hash:", hash);
    onProgress?.("⏳ generating quiz...");

    const receipt = await activeClient.waitForTransactionReceipt({
      hash,
      status: "ACCEPTED",
      retries: 150,
      interval: 2000,
    });

    console.log("✅ Transaction confirmed!", receipt);
    console.log("📦 Receipt data:", JSON.stringify(receipt, null, 2));
    onProgress?.("✅ Quiz generated!");

    // Extract quiz data from GenLayer consensus receipt
    // Path: consensus_data.leader_receipt[0].result.payload.readable
    try {
      const leaderReceipt = receipt?.consensus_data?.leader_receipt;

      if (leaderReceipt && leaderReceipt.length > 0) {
        const resultPayload = leaderReceipt[0]?.result?.payload;

        if (resultPayload?.readable) {
          const parsed = parseDynamicJSON<QuizData>(resultPayload.readable);
          if (parsed) {
            console.log("✅ Parsed quiz data from consensus payload:", parsed);
            return parsed;
          }
        }
      }

      // Fallback: check receipt.result directly
      if (receipt?.result) {
        const parsed = parseDynamicJSON<QuizData>(receipt.result);
        if (parsed) {
          console.log("✅ Parsed quiz data from receipt.result:", parsed);
          return parsed;
        }
      }

      console.error("❌ No quiz data found in receipt");
      console.error("❌ Receipt structure:", JSON.stringify(receipt, null, 2));
      return null;
    } catch (parseError) {
      console.error("❌ Parse error:", parseError);
      console.error("❌ Receipt was:", receipt);
      return null;
    }
  } catch (e: any) {
    console.error("❌ Generate quiz error:", e);

    // Check for specific error types and show user-friendly messages
    const errorMessage = e?.message || String(e);

    if (errorMessage.includes("not ACCEPTED") || errorMessage.includes("Transaction status")) {
      onProgress?.("❌ Failed to generate quiz. Transaction was rejected.");
    } else if (errorMessage.includes("timeout") || errorMessage.includes("retries")) {
      onProgress?.("❌ Failed to generate quiz. Request timed out.");
    } else {
      onProgress?.("❌ Failed to generate quiz. Please try again.");
    }

    return null;
  }
};

// Submit answers and get results
export const submitAnswers = async (
  answers: string[],
  onProgress?: (status: string) => void
): Promise<QuizResult | null> => {
  try {
    const activeClient = await initializeGenLayer();
    if (!activeClient) {
      onProgress?.("❌ Failed to initialize GenLayer");
      return null;
    }

    onProgress?.("⚠️ Submitting answers...");

    const hash = await activeClient.writeContract({
      address: CONTRACT_ADDRESS,
      functionName: "submit_answers",
      args: [answers],
    });

    console.log("✅ Answers submitted! Hash:", hash);
    onProgress?.("⏳ Calculating results...");

    const receipt = await activeClient.waitForTransactionReceipt({
      hash,
      status: "ACCEPTED",
      retries: 150,
      interval: 2000,
    });

    console.log("✅ Results received!", receipt);
    onProgress?.("✅ Results ready!");

    // Extract result from GenLayer consensus receipt
    // Path: consensus_data.leader_receipt[0].result.payload.readable
    try {
      const leaderReceipt = receipt?.consensus_data?.leader_receipt;

      if (leaderReceipt && leaderReceipt.length > 0) {
        const resultPayload = leaderReceipt[0]?.result?.payload;

        if (resultPayload?.readable) {
          const parsed = parseDynamicJSON<QuizResult>(resultPayload.readable);
          if (parsed) {
            console.log("✅ Parsed quiz result from consensus payload:", parsed);
            return parsed;
          }
        }
      }

      // Fallback: check receipt.result directly
      if (receipt?.result) {
        const parsed = parseDynamicJSON<QuizResult>(receipt.result);
        if (parsed) {
          console.log("✅ Parsed quiz result from receipt.result:", parsed);
          return parsed;
        }
      }

      console.error("❌ No result found in receipt");
      return null;
    } catch (parseError) {
      console.error("❌ Parse error:", parseError);
      console.error("❌ Receipt was:", receipt);
      return null;
    }
  } catch (e) {
    console.error("❌ Submit answers error:", e);
    onProgress?.("❌ Error submitting answers");
    return null;
  }
};

// Check if GenLayer is configured
export const isGenLayerConfigured = (): boolean => {
  return !!import.meta.env.VITE_GENLAYER_KEY;
};

// ========== CUSTOM MODE CONTRACT FUNCTIONS ==========

export interface CustomQuizData {
  summary: string;
  questions: {
    question: string;
    options: string[];
    answer: string;
  }[];
}

export interface CustomQuizResult {
  quiz_id: number;
  score: number;
  total: number;
  percentage: number;
}

// Generate quiz from user's custom material
export const generateCustomQuiz = async (
  material: string,
  difficulty: string,
  onProgress?: (status: string) => void
): Promise<{ quiz: CustomQuizData; quizId: number } | null> => {
  try {
    const activeClient = await initializeGenLayer();
    if (!activeClient) {
      onProgress?.("❌ Failed to initialize GenLayer");
      return null;
    }

    onProgress?.("⚠️ Analyzing your material... This may take 1-2 minutes.");

    const hash = await activeClient.writeContract({
      address: CUSTOM_CONTRACT_ADDRESS,
      functionName: "generate_quiz",
      args: [material, difficulty],
    });

    console.log("✅ Transaction sent! Hash:", hash);
    onProgress?.("⏳ Generating quiz from your material...");

    const receipt = await activeClient.waitForTransactionReceipt({
      hash,
      status: "ACCEPTED",
      retries: 150,
      interval: 2000,
    });

    console.log("✅ Transaction confirmed!", receipt);
    onProgress?.("✅ Quiz generated!");

    // Extract quiz_id from receipt
    let quizId = 0;
    try {
      const leaderReceipt = receipt?.consensus_data?.leader_receipt;
      if (leaderReceipt && leaderReceipt.length > 0) {
        const resultPayload = leaderReceipt[0]?.result?.payload;
        if (resultPayload?.readable !== undefined) {
          quizId = parseInt(resultPayload.readable) || 0;
        }
      }
    } catch (e) {
      console.error("❌ Failed to parse quiz_id:", e);
    }

    // Now fetch the quiz data
    onProgress?.("📥 Fetching quiz data...");
    const quizJson = await activeClient.readContract({
      address: CUSTOM_CONTRACT_ADDRESS,
      functionName: "get_quiz",
      args: [quizId],
    });

    console.log("📝 Quiz JSON:", quizJson);

    const quizData = parseDynamicJSON<CustomQuizData>(quizJson);
    if (!quizData) {
      throw new Error("Failed to parse custom quiz data");
    }

    return { quiz: quizData, quizId };
  } catch (e: any) {
    console.error("❌ Generate custom quiz error:", e);
    const errorMessage = e?.message || String(e);

    if (errorMessage.includes("not ACCEPTED") || errorMessage.includes("Transaction status")) {
      onProgress?.("❌ Failed to generate quiz. Transaction was rejected.");
    } else if (errorMessage.includes("timeout") || errorMessage.includes("retries")) {
      onProgress?.("❌ Failed to generate quiz. Request timed out.");
    } else {
      onProgress?.("❌ Failed to generate quiz. Please try again.");
    }

    return null;
  }
};

// Grade custom quiz answers
export const gradeCustomQuiz = async (
  quizId: number,
  answers: string[],
  onProgress?: (status: string) => void
): Promise<CustomQuizResult | null> => {
  try {
    const activeClient = await initializeGenLayer();
    if (!activeClient) {
      onProgress?.("❌ Failed to initialize GenLayer");
      return null;
    }

    onProgress?.("⚠️ Grading your answers...");

    // grade_quiz is a view function, so we use readContract
    const resultJson = await activeClient.readContract({
      address: CUSTOM_CONTRACT_ADDRESS,
      functionName: "grade_quiz",
      args: [quizId, answers],
    });

    console.log("✅ Grade result:", resultJson);
    onProgress?.("✅ Results ready!");

    const result = parseDynamicJSON<CustomQuizResult>(resultJson);
    if (!result) {
      throw new Error("Failed to parse custom quiz results");
    }

    return result;
  } catch (e) {
    console.error("❌ Grade custom quiz error:", e);
    onProgress?.("❌ Error grading quiz");
    return null;
  }
};
