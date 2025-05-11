export interface RoadMapStep {
  id: string;
  step: number;
  title: string;
  description: string;
  tags: string[];
  subRoadMapId: string | null;
  isBookmarked?: boolean;
}

export interface LearningResource {
  id: string;
  url: string;
}

export interface StepDetail {
  id: string;
  content: string;
}

export interface StepPreview {
  roadMapId: string;
  stepId: string;
  title: string;
}

export interface RoadMapPreview {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoadMap {
  id: string;
  title: string;
  steps: RoadMapStep[];
  createdAt: string;
  updatedAt: string;
}

const BACKEND_API = process.env.REACT_APP_BACKEND_API;
class RoadMapService {
  private static instance: RoadMapService;

  private constructor() { }

  public static getInstance(): RoadMapService {
    if (!RoadMapService.instance) {
      RoadMapService.instance = new RoadMapService();
    }
    return RoadMapService.instance;
  }

  public async createRoadMap(job: string, etc: string): Promise<string> {
    const response = await fetch(`${BACKEND_API}/roadmap`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ target_job: job, instruct: etc })
    });

    const data = await response.json();
    return Promise.resolve(data["id"]);
  }

  public async getRoadMap(id: string): Promise<RoadMap | null> {
    const response = await fetch(`${BACKEND_API}/roadmap/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = await response.json();
    return Promise.resolve(data);
  }

  public async getStepDetail(stepId: string): Promise<ReadableStream<Uint8Array>> {
    const response = await fetch(`${BACKEND_API}/roadmap/step/${stepId}/guide`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.body) {
      throw new Error('Response body is null');
    }

    return response.body;
  }

  public async update(roadMap: RoadMap): Promise<void> {
    return Promise.resolve();
  }

  public async getRecommendLearningResource(stepId: string): Promise<LearningResource[]> {
    const response = await fetch(`${BACKEND_API}/roadmap/step/${stepId}/resources`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = await response.json();

    const result: LearningResource[] = [];
    for (let i = 0; i < data["resources"].length; i++) {
      result.push({
        id: data["resources"][i]["id"],
        url: data["resources"][i]["url"]
      });
    }

    return Promise.resolve(result);
  }

  public async updateRecommendLearningResource(stepId: string, urls: string[]): Promise<void> {
    // TODO: 실제 API 연동 시 서버에 저장
    return Promise.resolve();
  }

  public async addRecommendResource(stepId: string, count: number): Promise<string[]> {
    // TODO: 실제 AI 추천 API 연동
    // 임시로 count만큼의 더미 URL 반환
    return Array.from({ length: count }, (_, i) => `https://ai-recommend.com/resource/${stepId}/${i + 1}`);
  }

  public async callAI(roadmapId: string, userInput: string): Promise<ReadableStream<Uint8Array>> {
    const response = await fetch(`${BACKEND_API}/roadmap/${roadmapId}/assistant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ user_input: userInput })
    });

    if (!response.body) {
      throw new Error('Response body is null');
    }

    return response.body;
  }

  public async createSubRoadMap(stepId: string): Promise<string> {
    return Promise.resolve(crypto.randomUUID().toString());
  }

  public async getMyRoadMaps(): Promise<RoadMapPreview[]> {
    const response = await fetch(`${BACKEND_API}/roadmap`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    const data = await response.json();
    const result: RoadMapPreview[] = [];
    for (let i = 0; i < data["roadmaps"].length; i++) {
      result.push({
        id: data["roadmaps"][i]["uid"],
        title: data["roadmaps"][i]["title"],
        createdAt: data["roadmaps"][i]["created_at"],
        updatedAt: data["roadmaps"][i]["updated_at"]
      });
    }

    return Promise.resolve(result);
  }

  public async getBookMarks(): Promise<StepPreview[]> {
    const response = await fetch(`${BACKEND_API}/roadmap/bookmarks`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = await response.json();

    const result: StepPreview[] = [];
    for (let i = 0; i < data["steps"].length; i++) {
      result.push({
        roadMapId: data["steps"][i]["roadmap_uid"],
        stepId: data["steps"][i]["step_uid"],
        title: data["steps"][i]["title"]
      });
    }
    return Promise.resolve(result);
  }

  public async updateBookMarkStatus(stepId: string): Promise<void> {
    const response = await fetch(`${BACKEND_API}/roadmap/step/${stepId}/bookmark`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return Promise.resolve();
  }
}

export default RoadMapService;
