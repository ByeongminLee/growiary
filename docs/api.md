# user

<img src="https://img.shields.io/badge/%7F%20%20GET%20%20%20%7F-/user-e1e1e1?labelColor=46C487&style=flat-square" height="25"/>

> 사용자 조회

- request

  none

- response

  ```json
  {
    "status": 200,
    "data": {
      "user": {
        "image": "https://imageurl.com",
        "emailVerified": null,
        "name": "홍길동",
        "email": "hong@gmail.com"
      },
      "profile": {
        "createdAt": "2024-01-29T14:37:32.662Z",
        "agreeTerms": {
          "marketing": false,
          "service": true,
          "privacy": true,
          "age": true
        },
        "userName": "유저 이름",
        "updatedAt": "2024-01-29T14:46:27.273Z"
      }
    }
  }
  ```

<br/>

<img src="https://img.shields.io/badge/%7F%20%20POST%20%7F-/user/profile-e1e1e1?labelColor=219BFD&style=flat-square" height="25"/>

> 회원 가입 직후, 사용자 이름 및 이용약관 정보 등록

- request

  `@body`

  ```json
  {
    userName: string;
    agreeTerms:{
      age: boolean;
      service: boolean;
      privacy: boolean;
      marketing?: boolean
      };
  }
  ```

- response

  ```json
  {
    "status": 200,
    "data": {
      "agreeTerms": {
        "age": true,
        "service": true,
        "privacy": true,
        "marketing": false
      },
      "userName": "홍길동",
      "createdAt": "2024-01-30T01:44:44.417Z",
      "updatedAt": "2024-01-30T01:44:44.417Z"
    }
  }
  ```

<br/>

<img src="https://img.shields.io/badge/%7F%20%20Patch%20%20%20%7F-/user/profile-e1e1e1?labelColor=F89331&style=flat-square" height="25"/>

> 사용자 정보 수정

- request

  `@body`

  ```json
  {
    "userName": "김철수"
  }
  ```

- response

  ```json
  {
    "status": 200,
    "data": {
      "updatedAt": "2024-01-30T01:45:51.114Z",
      "userName": "김철수"
    }
  }
  ```

<br />

<br />

# post

<img src="https://img.shields.io/badge/%7F%20%20GET%20%20%20%7F-/post-e1e1e1?labelColor=46C487&style=flat-square" height="25"/>

> 사용자 포스팅 가져오기

<br/>

<img src="https://img.shields.io/badge/%7F%20%20POST%20%7F-/post-e1e1e1?labelColor=219BFD&style=flat-square" height="25"/>

> 사용자 포스팅 작성

- request

  `@body`

  ```typescript
  {
    title?: string;
    content: string;
    template?: string;
  }
  ```

<br/>

<img src="https://img.shields.io/badge/%7F%20%20POST%20%7F-/post/filter-e1e1e1?labelColor=219BFD&style=flat-square" height="25"/>

> 필터를 사용하여 사용자 요청

- request

  `@body`

  ```typescript
  {
    // yyyy-mm-dd
    startDate: string;
    endDate: string;
  }
  ```

<br/>

<img src="https://img.shields.io/badge/%7F%20%20POST%20%7F-/post/ai-e1e1e1?labelColor=219BFD&style=flat-square" height="25"/>

> 사용자 포스팅 작성 및 ai 요청

- request

  `@body`

  ```typescript
  {
    title?: string;
    content: string;
    template?: string;
    date?: string | Date;
    offset?: string | number;
  }
  ```

  > date값이 없을 경우 현재 서버 시간입력
  > date값이 있고 offset값이 없을 경우 date값 입력
  > date값과 offset값이 둘다 있을 경우 date + offset(분) 시간으로 계산

- response

  ```json
  {
    "status": 200,
    "data": {
       {
        "postId":"9073f424-9108-4862-9fd1-370c90657ff2",
        "title": "제목",
        "content": "다이어리 작성 내용",
        "template": "템플릿",
        "answer": "... AI 답변 ...",
        "ai": {
          "id": "chatcmpl-8nKImrLq6tRBJfGUUJ8X8Yx6To9Js",
          "created": 1706766804,
          "usage": {
            "prompt_tokens": 892,
            "completion_tokens": 405,
            "total_tokens": 1297
          }
        },
        "createAt": "2024-02-01T05:53:43.318Z",
        "updateAt": "2024-02-01T05:53:43.318Z"
      }
    }
  }
  ```

<br/>

<img src="https://img.shields.io/badge/%7F%20%20POST%20%7F-/post/feedback-e1e1e1?labelColor=219BFD&style=flat-square" height="25"/>

> post에 피드백 추가

- request

  `@body`

  ```typescript
  {
    postId: string;
    feedback: 'GOOD' | 'BAD';
  }
  ```

- response

```json
{
  "status": 200,
  "message": "Feedback added successfully"
}
```

<br/>

<img src="https://img.shields.io/badge/%7F%20%20POST%20%7F-/post/edit-e1e1e1?labelColor=219BFD&style=flat-square" height="25"/>

> post정보 수정

- request

  `@body`

  ```typescript
  {
    postId: string;
    content?: string;
    status?: 'ACTIVE'|'DELETED'
  }
  ```

- response

```
{
    "status": 200,
    "message": "content updated successfully",
    "STATUS": "DELETED",
    "data": {
        "template": "7",
        "answer": "AI 답장",
        "ai": {
            ...
        },
        "updateAt": "2024-02-16T04:47:10.440Z",
        "content": "포스트 수정",
        "createAt": "2024-02-16T04:47:10.440Z",
        "feedback": "GOOD"
    }
}
```
