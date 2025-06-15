import { OnBoardingData } from "../types/onboarding";
import { api } from "@/core/api";

export class onBoardingService {
  async getOnBoardingData(): Promise<OnBoardingData> {
    const response = await api.get("/api/onboarding");
    return response.data as OnBoardingData;
  }
}
