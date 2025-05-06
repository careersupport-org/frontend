export interface RoadMapStep {
  step: number;
  title: string;
  description: string;
}

export interface RoadMap {
  id: string;
  title: string;
  steps: RoadMapStep[];
}

class RoadMapService {
  private static instance: RoadMapService;
  private roadMaps: Map<string, RoadMap>;

  private constructor() {
    this.roadMaps = new Map();
  }

  public static getInstance(): RoadMapService {
    if (!RoadMapService.instance) {
      RoadMapService.instance = new RoadMapService();
    }
    return RoadMapService.instance;
  }

  public async createRoadMap(job: string, etc: string): Promise<string> {
    const id = crypto.randomUUID().toString();
    const roadMap: RoadMap = {
      id,
      title: `${job}의 로드맵`,
      steps: [
        {
          step: 1,
          title: "기초 프로그래밍 학습",
          description: "Python, JavaScript 등 기초 문법과 알고리즘 익히기",
      
        },
        {
          step: 2,
          title: "웹 개발 기본",
          description: "HTML, CSS, JavaScript로 간단한 웹페이지 만들어보기",
      
        },
        {
          step: 3,
          title: "프레임워크 활용",
          description: "React, Vue 등 프론트엔드 프레임워크 학습",
      
        },
        {
          step: 4,
          title: "프로젝트 및 포트폴리오",
          description: "작은 프로젝트를 직접 만들어보고 GitHub에 정리",
      
        },
        {
          step: 5,
          title: "심화 학습 및 취업 준비",
          description: "CS 지식, 코딩테스트, 면접 준비 및 최신 트렌드 학습",
      
        },
      ],
    };
    
    this.roadMaps.set(id, roadMap);
    return id;
  }

  public async getRoadMap(id: string): Promise<RoadMap | null> {
    return this.roadMaps.get(id) || null;
  }
}

export default RoadMapService;
