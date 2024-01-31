export type UserProfileDTO = {
  agreeTerms: AgreeTermsDTO;
  userName: string;
};

export type UserProfileUpdateDTO = {
  agreeTerms?: AgreeTermsDTO;
  userName?: string;
};

export type AgreeTermsDTO = {
  age: boolean;
  service: boolean;
  privacy: boolean;
  marketing?: boolean;
};
