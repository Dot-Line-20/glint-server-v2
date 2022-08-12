# PG 심사용 API Document

## 회원가입

```plain
[POST] /auth/signup
```

| key      | type   | description                                    |
| -------- | ------ | ---------------------------------------------- |
| email    | string | 이메일 형식에 맞춰 입력합니다.                 |
| password | string | 암호화하지 않고 plain으로 보내줘도 괜찮습니다. |
| name     | string | 입력 제약은 없습니다.                          |

### Response

- OK

```json
{
  "accessToken": string,
  "refreshToken" string,
}
```

> 이메일과 이름이 모두 존재하는 경우, 이메일 오류가 발생합니다.

- 400 - 이미 존재하는 이메일

```json
{
  "message": "이미 존재하는 이메일입니다."
}
```

- 400 - 이미 존재하는 이름

```json
{
  "message": "이미 존재하는 이름입니다."
}
```

## 로그인

```plain
[POST] /auth/signin
```

| key      | type   | description                                    |
| -------- | ------ | ---------------------------------------------- |
| email    | string | 이메일 형식에 맞춰 입력합니다.                 |
| password | string | 암호화하지 않고 plain으로 보내줘도 괜찮습니다. |

### Response

- OK

```json
{
  "accessToken": string,
  "refreshToken" string
}
```

- 401 - 사용자 정보 오류

```json
{
  "message": "아이디 또는 비밀번호가 잘못되었습니다."
}
```

## 리프레시 토큰

Authorization 헤더에 bearer로 refresh Token을 보냅니다.

```plain
[GET] /auth/refresh
```

### Response

- OK

```json
{
  "accessToken": string,
  "refreshToken" string
}
```

## 사용자 정보 불러오기

> 인증이 필요한 라우터입니다.

### Response

```json
{
  "name": string,
  "email": string,
}
```

## 토큰 오류

- 토큰 없음: 토큰이 Authorization헤더에 bearer로 입력되지 않았을 때 발생합니다.

```json
{
  "code": "TOKEN_REQUIRED",
  "message": "토큰이 필요합니다."
}
```

- 토큰 타입 불일치: 요구되는 토큰 타입이 일치하지 않는 경우 발생합니다.

```json
{
  "code": "TOKEN_TYPE_MISMATCH",
  "message": "토큰 타입이 일치하지 않습니다."
}
```

- 토큰 오류

```json
{
  "code": "TOKEN_EXPIRED",
  "message": "토큰이 유효하지 않습니다."
}
```

- 토큰 만료

```json
{
  "code": "TOKEN_INVALID",
  "message": "토큰이 만료되었습니다."
}
```

- 사용자 확인 실패

```json
{
  "code": "TOKEN_FAILED",
  "message": "사용자를 확인하는데 실패했습니다."
}
```

## 상품 불러오기

```plain
[GET] /products
```

### Response

- OK

```json
{
  "id": string,
  "name": string,
  "price": number,
  "detail": string
}
```

## 빌링키 발급

> 인증이 필요한 라우터입니다.

```plain
[POST] /payment/key
```

| key      | type   | description                                                 |
| -------- | ------ | ----------------------------------------------------------- |
| CardNo   | string | 카드번호                                                    |
| ExpYear  | string | 만료 년도.                                                  |
| ExpMonth | string | 만료 월.                                                    |
| IDNo     | string | 생년월일 6자리 또는 사업자번호 10자리                       |
| CardPw   | string | 카드 비밀번호 앞 두 자리 입니다.                            |
| CardName | string | 카드이름입니다. 입력하지 않으면 카드사 이름으로 등록됩니다. |

### Response

- OK

```json
{
  "id": string,
  "name": string,
  "type": 0 | 1, // 0: 신용카드, 1: 체크카드
  "createdAt": string,
}
```

- 카드 정보 오류

```json
{
  "code": "CARD_INFO_NOT_MATCH",
  "message": "카드 정보가 올바르지 않습니다."
}
```

- 이미 등록된 카드

```json
{
  "code": "CARD_ALREADY_REGISTERED",
  "message": "이미 등록된 카드입니다."
}
```

## 카드 정보 가져오기

> 인증이 필요한 라우터입니다.

```plain
[GET] /payment/key
```

### Response

- OK

```json
{
  "id": string,
  "name": string,
  "type": 0 | 1, // 0: 신용카드, 1: 체크카드
  "createdAt": string
}[]
```

## 결제

> 인증이 필요한 라우터입니다.

```plain
[POST] /payment/pay
```

| key       | type   | description                         |
| --------- | ------ | ----------------------------------- |
| cardId    | string | `/payment/key`에서 얻은 id입니다.   |
| productId | string | `/products`에서 얻은 상품 id입니다. |

### Response

- OK

```json
{
  "id": string, // 결제 id입니다.
  "price": number,
  "createdAt": string,
  "productName": string
}
```

- 카드 id가 올바르지 않음

```json
{
  "message": "카드 정보가 없습니다."
}
```

- 상품 id가 올바르지 않음

```json
{
  "message": "상품 정보가 없습니다."
}
```

- 결제 실패

```json
{
  "code": string,
  "message": string
}
```

## 결제 이력

> 인증이 필요한 라우터입니다.

```plain
[GET] /payment/history
```

### Response

- OK

```json
{
  "id": string, // 결제 id입니다.
  "price": number,
  "canceled": string,
  "createdAt": string,
  "updatedAt": string, // 업데이트 일시는 결제 취소 시간 등 처리일시로 사용할 수 있습니다.
  "productName": string,
}[]
```

## 결체 취소 (development)

> 개발용 취소 라우터입니다.

> 인증이 필요한 라우터입니다.

```plain
[POST] /payment/cancel
```

| key           | type   | description    |
| ------------- | ------ | -------------- |
| transactionId | string | 결제 id입니다. |

### Response

- OK
  200 코드만 전달됩니다.

- transactionId 불일치

```json
{
  "message": "존재하지 않는 거래입니다."
}
```

- 취소 실패

```json
{
  "code": string,
  "message": string
}
```
