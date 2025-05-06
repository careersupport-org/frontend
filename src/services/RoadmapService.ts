export interface RoadMapStep {
  id: string;
  step: number;
  title: string;
  description: string;
  tags: string[];
  subRoadMapId: string | null;
}

export interface StepDetail {
  id: string;
  content: string;
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
          id: crypto.randomUUID().toString(),
          step: 1,
          title: "기초 프로그래밍 학습",
          description: "Python, JavaScript 등 기초 문법과 알고리즘 익히기",
          tags: ["Python", "JavaScript", "알고리즘", "자료구조"],
          subRoadMapId: null
        },
        {
          id: crypto.randomUUID().toString(),
          step: 2,
          title: "웹 개발 기본",
          description: "HTML, CSS, JavaScript로 간단한 웹페이지 만들어보기",
          tags: ["HTML", "CSS", "JavaScript", "웹 기초"],
          subRoadMapId: "abcd1234"
        },
        {
          id: crypto.randomUUID().toString(),
          step: 3,
          title: "프레임워크 활용",
          description: "React, Vue 등 프론트엔드 프레임워크 학습",
          tags: ["React", "Vue", "프론트엔드", "상태관리"],
          subRoadMapId: null
        },
        {
          id: crypto.randomUUID().toString(),
          step: 4,
          title: "프로젝트 및 포트폴리오",
          description: "작은 프로젝트를 직접 만들어보고 GitHub에 정리",
          tags: ["GitHub", "포트폴리오", "프로젝트", "협업"],
          subRoadMapId: null
        },
        {
          id: crypto.randomUUID().toString(),
          step: 5,
          title: "심화 학습 및 취업 준비",
          description: "CS 지식, 코딩테스트, 면접 준비 및 최신 트렌드 학습",
          tags: ["CS", "코딩테스트", "면접", "트렌드"],
          subRoadMapId: null
        },
      ],
    };
    
    this.roadMaps.set(id, roadMap);
    return id;
  }

  public async getRoadMap(id: string): Promise<RoadMap | null> {
    return this.roadMaps.get(id) || null;
  }

  public async getStepDetail(stepId: string): Promise<ReadableStream<Uint8Array>> {
    const encoder = new TextEncoder();
    let charIndex = 0;
    
    const content = `안녕하세요! ${stepId}번째 단계의 학습 가이드입니다.

이 단계에서는 기본적인 개념을 이해하는 것이 중요합니다. 특히 실습을 통해 배운 내용을 직접 적용해보시는 것을 추천드립니다.

다양한 예제를 통해 학습하면 더 효과적이며, 커뮤니티에 참여하여 다른 학습자들과 경험을 공유하는 것도 좋은 방법입니다.

정기적으로 복습하고 학습 내용을 정리하는 습관을 들이시면, 장기적으로 큰 도움이 될 것입니다.

마지막으로, 이 단계에서 꼭 알아야 할 핵심 개념들을 정리해드리겠습니다:
1. 기본 개념 이해하기
2. 실습을 통한 적용
3. 예제 학습
4. 커뮤니티 참여
5. 정기적인 복습

이러한 단계들을 차근차근 따라하시면, 충분히 이 단계를 마스터하실 수 있습니다.`;

    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        // 초기 데이터 전송
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ id: stepId, content: "" })}\n\n`));
        
        // 50ms마다 한 글자씩 전송
        const interval = setInterval(() => {
          if (charIndex < content.length) {
            const currentContent = content.slice(0, charIndex + 1);
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ id: stepId, content: currentContent })}\n\n`));
            charIndex++;
          } else {
            clearInterval(interval);
            controller.close();
          }
        }, 50);
      }
    });

    return stream;
  }

  public async update(roadMap: RoadMap): Promise<void> {
    // 실제 API 연동 시에는 여기에 API 호출 코드가 들어갑니다.
    // 현재는 메모리 내 데이터만 업데이트합니다.
    this.roadMaps.set(roadMap.id, roadMap);
  }

  public async getRecommendLearningResource(stepId: string): Promise<string[]> {
    // TODO: 실제 API 연동 시 서버에서 추천 학습 자료를 가져옵니다.
    // 현재는 임시 데이터를 반환합니다.
    return [
      'https://wikidocs.net/book/14314',
      'https://developer.mozilla.org',
      'https://www.inflearn.com/course/%EC%BB%B4%ED%93%A8%ED%84%B0%EA%B8%B0%EC%B4%88-%EA%B2%8C%EC%9D%B4%ED%8A%B8-3'
    ];
  }

  public async updateRecommendLearningResource(stepId: string, urls: string[]): Promise<void> {
    // TODO: 실제 API 연동 시 서버에 저장
    return Promise.resolve();
  }
}

export default RoadMapService;
