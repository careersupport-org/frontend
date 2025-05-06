interface CreateRoadMapParams {
  job: string;
  etc: string;
}

const RoadMapService = {
  createRoadMap: async ({ job, etc }: CreateRoadMapParams): Promise<string> => {
    // 실제 API 연동 시 여기에 fetch/axios 코드 작성
    // 예시: const res = await axios.post('/api/roadmap', { job, etc }); return res.data.id;
    // 임시로 랜덤 id 반환
    const id = Math.random().toString(36).substring(2, 10);
    return Promise.resolve(id);
  },
};

export default RoadMapService;
