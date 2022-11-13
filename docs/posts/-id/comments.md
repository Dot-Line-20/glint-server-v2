# Comments

---

## 댓글 생성

```plain
[POST] /posts/:postId/comments
```

### Request

#### Parameter

|key|type|description|
|---|---|---|
|postId|number|자연수인 숫자입니다|

#### Header

|key|type|description|
|---|---|---|
|Authorization|string|Bearer 타입의 json web token 형식 문자열입니다 (accessToken)|

#### Body

|key|type|description|
|---|---|---|
|content|string|최소 1자 최대 65535자의 길이 제한이 있는 플레인 텍스트 형식의 문자열입니다|

### Response

#### 200

- 성공
	```json
	{
		"status": "success",
		"data": {
			"id": "<number, natural number>",
			"userId": "<number, natural number>",
			"postId": "<number, natural number>",
			"content": "<string, length 1 to 65535>",
			"createdAt": "<string, ISO 8601 Date and time in UTC format>"
		}
	}
	```

---

## 모든 댓글

```plain
[GET] /posts/:postId/comments
```

### Request

#### Parameter

|key|type|description|
|---|---|---|
|postId|number|자연수인 숫자입니다|

#### Header

|key|type|description|
|---|---|---|
|Authorization|string|Bearer 타입의 json web token 형식 문자열입니다 (accessToken)|

#### Query

|key|type|description|
|---|---|---|
|page[size]|_number_|자연수이며 기본 50입니다|
|page[index]|_number_|양의 정수이며 기본 0입니다|
|page[order]|_'asc' \| 'desc'_|'asc' 또는 'desc'이며 기본 'desc'입니다|

### Response

#### 200

- 성공
	```json
	{
		"status": "success",
		"data": {
			"id": "<number, natural number>",
			"userId": "<number, natural number>",
			"postId": "<number, natural number>",
			"content": "<string, length 1 to 65535>",
			"createdAt": "<string, ISO 8601 Date and time in UTC format>"
		}[]
	}
	```

---

## 댓글 수정

```plain
[PATCH] /posts/:postId/comments/:id
```

### Request

#### Parameter

|key|type|description|
|---|---|---|
|postId|number|자연수인 숫자입니다|
|id|number|자연수인 숫자입니다|

#### Header

|key|type|description|
|---|---|---|
|Authorization|string|Bearer 타입의 json web token 형식 문자열입니다 (accessToken)|

#### Body

|key|type|description|
|---|---|---|
|content|_string_|최소 1자 최대 65535자의 길이 제한이 있는 플레인 텍스트 형식의 문자열입니다|

### Response

#### 200

- 성공
	```json
	{
		"status": "success",
		"data": {
			"id": "<number, natural number>",
			"userId": "<number, natural number>",
			"postId": "<number, natural number>",
			"content": "<string, length 1 to 65535>",
			"createdAt": "<string, ISO 8601 Date and time in UTC format>"
		}
	}
	```

#### 401

- 요청하는 유저와 작성자 불일치
	```json
	{
		"status": "fail",
		"data": {
			"title": "Unauthorized user"
		}
	}
	```

---

## 댓글 삭제

```plain
[DELETE] /posts/:postId/comments/:id
```

### Request

#### Parameter

|key|type|description|
|---|---|---|
|postId|number|자연수인 숫자입니다|
|id|number|자연수인 숫자입니다|

#### Header

|key|type|description|
|---|---|---|
|Authorization|string|Bearer 타입의 json web token 형식 문자열입니다 (accessToken)|

### Response

#### 200

- 성공
	```json
	{
		"status": "success",
		"data": null
	}
	```

#### 401

- 요청하는 유저와 작성자 불일치
	```json
	{
		"status": "fail",
		"data": {
			"title": "Unauthorized user"
		}
	}
	```