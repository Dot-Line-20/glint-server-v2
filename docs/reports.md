# Reports

---

## 신고 생성

```plain
[POST] /reports
```

### Request

#### Header

|key|type|description|
|---|---|---|
|Authorization|string|Bearer 타입의 json web token 형식 문자열입니다 (accessToken)|

#### Body

|key|type|description|
|---|---|---|
|commentId|_number_|자연수인 숫자입니다|
|postId|_number_|자연수인 숫자입니다|
|userId|_number_|자연수인 숫자입니다|
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
			"content": "<string, length 1 to 65535>",
			"createdAt": "<string, ISO 8601 Date and time in UTC format>",
			"comment": {
				"comment": {
					"id": "<number, natural number>",
					"userId": "<number, natural number>",
					"postId": "<number, natural number>",
					"content": "<string, length 1 to 65535>",
					"isDeleted": "<boolean>",
					"createdAt": "<string, ISO 8601 Date and time in UTC format>"
				}
			}/* | null */,
			"post": {
				"post": {
					"id": "<number, natural number>",
					"userId": "<number, natural number>",
					"content": "<string, length 1 to 65535>",
					"isDeleted": "<boolean>",
					"createdAt": "<string, ISO 8601 Date and time in UTC format>"
				}
			}/* | null */,
			"user_": {
				"user": {
					"id": "<number, natural number>",
					"email": "<string, email format>",
					"name": "<string, length 1 to 64>",
					"birth": "<string, ISO 8601 Date format>",
					"media": {
						"id": "<number, natural number>",
						"name": "<string, hex encoded and length 128>",
						"type": "<string, length 3>",
						"userId": "<number, natural number>",
						"isImage": "<boolean>",
						"createdAt": "<string, ISO 8601 Date and time in UTC format>"
					}/* | null */,
					"createdAt": "<string, ISO 8601 Date and time in UTC format>"
				}
			}/* | null */
		}
	}
	```

#### 400

- 존재하지 않는 댓글
	```json
	{
		"status": "fail",
		"data": {
			"title": "Invalid commentId"
		}
	}
	```

- 존재하지 않는 게시글
	```json
	{
		"status": "fail",
		"data": {
			"title": "Invalid postId"
		}
	}
	```

- 존재하지 않는 유저
	```json
	{
		"status": "fail",
		"data": {
			"title": "Invalid userId"
		}
	}
	```

- 중복된 식별자
	```json
	{
		"status": "fail",
		"data": {
			"title": "Duplicated id"
		}
	}
	```

- 요청하는 유저와 댓글 작성자 일치 또는 요청하는 유저와 게시물 작성자 일치 또는 요청하는 유저와 유저 일치
	```json
	{
		"status": "fail",
		"data": {
			"title": "Invalid user"
		}
	}
	```

---

## 모든 신고

```plain
[GET] /reports
```

### Request

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
			"content": "<string, length 1 to 65535>",
			"createdAt": "<string, ISO 8601 Date and time in UTC format>",
			"comment": {
				"comment": {
					"id": "<number, natural number>",
					"userId": "<number, natural number>",
					"postId": "<number, natural number>",
					"content": "<string, length 1 to 65535>",
					"isDeleted": "<boolean>",
					"createdAt": "<string, ISO 8601 Date and time in UTC format>"
				}
			}/* | null */,
			"post": {
				"post": {
					"id": "<number, natural number>",
					"userId": "<number, natural number>",
					"content": "<string, length 1 to 65535>",
					"isDeleted": "<boolean>",
					"createdAt": "<string, ISO 8601 Date and time in UTC format>"
				}
			}/* | null */,
			"user_": {
				"user": {
					"id": "<number, natural number>",
					"email": "<string, email format>",
					"name": "<string, length 1 to 64>",
					"birth": "<string, ISO 8601 Date format>",
					"media": {
						"id": "<number, natural number>",
						"name": "<string, hex encoded and length 128>",
						"type": "<string, length 3>",
						"userId": "<number, natural number>",
						"isImage": "<boolean>",
						"createdAt": "<string, ISO 8601 Date and time in UTC format>"
					}/* | null */,
					"createdAt": "<string, ISO 8601 Date and time in UTC format>"
				}
			}/* | null */
		}[]
	}
	```

---

## 신고

```plain
[GET] /reports/:id
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
			"id": "<number, natural number>",
			"userId": "<number, natural number>",
			"content": "<string, length 1 to 65535>",
			"createdAt": "<string, ISO 8601 Date and time in UTC format>",
			"comment": {
				"comment": {
					"id": "<number, natural number>",
					"userId": "<number, natural number>",
					"postId": "<number, natural number>",
					"content": "<string, length 1 to 65535>",
					"isDeleted": "<boolean>",
					"createdAt": "<string, ISO 8601 Date and time in UTC format>"
				}
			}/* | null */,
			"post": {
				"post": {
					"id": "<number, natural number>",
					"userId": "<number, natural number>",
					"content": "<string, length 1 to 65535>",
					"isDeleted": "<boolean>",
					"createdAt": "<string, ISO 8601 Date and time in UTC format>"
				}
			}/* | null */,
			"user_": {
				"user": {
					"id": "<number, natural number>",
					"email": "<string, email format>",
					"name": "<string, length 1 to 64>",
					"birth": "<string, ISO 8601 Date format>",
					"media": {
						"id": "<number, natural number>",
						"name": "<string, hex encoded and length 128>",
						"type": "<string, length 3>",
						"userId": "<number, natural number>",
						"isImage": "<boolean>",
						"createdAt": "<string, ISO 8601 Date and time in UTC format>"
					}/* | null */,
					"createdAt": "<string, ISO 8601 Date and time in UTC format>"
				}
			}/* | null */
		}
	}
	```

---

## 신고 삭제

```plain
[DELETE] /reports/:id
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