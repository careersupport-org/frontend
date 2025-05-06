interface MyProfile {
    bio: string;
  }
  
  const AccountService = {
    saveMyProfile: async ({ bio }: MyProfile): Promise<void> => {
      // 실제 API 연동 시 여기에 fetch/axios 코드 작성
      // 예시: await axios.post('/api/profile', { bio });
      return Promise.resolve(); // 임시 성공 처리
    },

    getMyProfile: async (): Promise<MyProfile> => {
      const myProfile = {
        bio: "안녕하세요. 저는 프론트엔드 개발자입니다.",
      }  
      return Promise.resolve(myProfile); // 임시 성공 처리
    },
  };
  
  export default AccountService