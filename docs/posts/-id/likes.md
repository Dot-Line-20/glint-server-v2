# Likes

---

## 좋아요 생성

```plain
[POST] /posts/:postId/likes
```

### Request

#### Parameter

|key|type|description|
|---|---|---|
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
		"data": {
			"postId": "<number, natural number>",
			"userId": "<number, natural number>",
		}
	}
	```

#### 409

- 이미 좋아요한 게시글
	```json
	{
		"status": "fail",
		"data": {
			"title": "Duplicated like"
		}
	}
	```

---

## 모든 좋아요

```plain
[GET] /posts/:postId/likes
```

### Request

#### Parameter

|key|type|description|
|---|---|---|
|id|number|자연수인 숫자입니다|

#### Header

|key|type|description|
|---|---|---|
|Authorization|string|Bearer 타입의 json web token 형식 문자열입니다 (accessToken)|

#### Query

|key|type|description|
|---|---|---|
|page[size]|_number_|자연수이며 기본 50입니다|
|page[index]|_number_|양의 정수이며 기본 0입니다|

### Response

#### 200

- 성공
	```json
	{
		"status": "success",
		"data": {
			"postId": "<number, natural number>",
			"user": {
				"id": "<number, natural number>",
				"email": "<string, email format>",
				"name": "<string, length 1 to 64>",
				"image": "<string, not decided>",
				"birth": "<string, ISO 8601 Date format>",
				"createdAt": "<string, ISO 8601 Date and time in UTC format>"
			}
		}[]
	}
	```

---

## 좋아요 삭제

```plain
[DELETE] /posts/:postId/likes/:userId
```

### Request

#### Parameter

|key|type|description|
|---|---|---|
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

#### 400

- 좋아요 하지 않은 게시글
	```json
	{
		"status": "fail",
		"data": {
			"title": "Not liked"
		}
	}
	```