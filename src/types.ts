export interface Listing {
  id: string;
  title: string;
  titleEn: string;
  category: "ships" | "engines" | "gear" | "services";
  categoryEn: string;
  price: number;
  year: number;
  condition: "new" | "used_excellent" | "used_good" | "used_fair";
  conditionEn: string;
  specifications: string;
  specificationsEn: string;
  location: string;
  locationEn: string;
  type: "sale" | "rent";
  image: string;
  ownerName: string;
  ownerPhone: string;
  ownerId: string;
  description: string;
  descriptionEn: string;
}

export interface ChatMessage {
  id: string;
  sender: "buyer" | "seller" | "mediator";
  text: string;
  time: string;
}

export interface NegotiationSession {
  id: string;
  listing: Listing;
  currentOffer: number;
  messages: ChatMessage[];
  brokerRecommendation?: {
    suggestionPrice: number;
    proposalDescription: string;
    buyerDraftMessage: string;
    sellerDraftMessage: string;
    surveyRequirement: string;
  };
  isLoading: boolean;
}

export interface AppraisalReport {
  estimatedValueMin: number;
  estimatedValueMax: number;
  confidenceScore: number;
  reviewNotes: string;
  pros: string[];
  cons: string[];
  marketDemandRating: string;
  brokerRecommendation: string;
}

export interface ContractDraft {
  contractTitle: string;
  preamble: string;
  clauses: { title: string; content: string }[];
  jurisdiction: string;
  escrowNote: string;
  htmlDraft: string;
}
