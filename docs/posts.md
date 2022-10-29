# Posts

---

## 게시글 생성

```plain
[POST] /posts
```

### Request

#### Header

|key|type|description|
|---|---|---|
|Authorization|string|Bearer 타입의 json web token 형식 문자열입니다 (accessToken)|

#### Body

|key|type|description|
|---|---|---|
|title|string|최소 1자 최대 64자의 길이 제한이 있는 플레인 텍스트 형식의 문자열입니다|
|content|string|최소 1자 최대 65535자의 길이 제한이 있는 플레인 텍스트 형식의 문자열입니다|
|mediaIds|number[]|자연수로 이루어진 배열입니다|
|categoryIds|number[]|자연수로 이루어진 배열입니다|

### Response

#### 200

- 성공
	```json
	{
		"status": "success",
		"data": {
			"id": "<number, positive integer>",
			"userId": "<number, positive integer>",
			"title": "<string, length 1 to 64>",
			"content": "<string, length 1 to 65535>",
			"createdAt": "<string, ISO 8601 Date and time in UTC format>",
			"medias": {
				"index": "<number, positive number>",
				"media": {
					"id": "<number, positive number>",
					"name": "<string, hex encoded and length 128>",
					"type": "<string, length 3>",
					"userId": "<number, positive number>",
					"isImage": "<boolean>",
					"createdAt": "<string, ISO 8601 Date and time in UTC format>"
				}
			}[],
			"categories": {
				"category": {
					"id": "<number, positive integer>",
					"name": "<string, length 1 to 64>",
				}
			}[],
			"_count": {
				"likes": "<number, positive number>"
			},
			"isLiked": "<boolean>"
		}
	}
	```

#### 400

- 존재하지 않는 미디어
	```json
	{
		"status": "fail",
		"data": {
			"title": "Invalid mediaIds"
		}
	}
	```

- 미디어 개수 초과
	```json
	{
		"status": "fail",
		"data": {
			"title": "Too many mediaIds"
		}
	}
	```

- 존재하지 않는 카테고리
	```json
	{
		"status": "fail",
		"data": {
			"title": "Invalid categoryIds"
		}
	}
	```

#### 401

- 요청하는 유저와 미디어 업로더 불일치
	```json
	{
		"status": "fail",
		"data": {
			"title": "Unauthorized user"
		}
	}
	```

#### 409

- 이미 사용중인 미디어
	```json
	{
		"status": "fail",
		"data": {
			"title": "Duplicated media usuage"
		}
	}
	```

---

## 모든 게시글

```plain
[GET] /posts
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
			"id": "<number, positive integer>",
			"userId": "<number, positive integer>",
			"title": "<string, length 1 to 64>",
			"content": "<string, length 1 to 65535>",
			"createdAt": "<string, ISO 8601 Date and time in UTC format>",
			"medias": {
				"index": "<number, positive number>",
				"media": {
					"id": "<number, positive number>",
					"name": "<string, hex encoded and length 128>",
					"type": "<string, length 3>",
					"userId": "<number, positive number>",
					"isImage": "<boolean>",
					"createdAt": "<string, ISO 8601 Date and time in UTC format>"
				}
			}[],
			"categories": {
				"category": {
					"id": "<number, positive integer>",
					"name": "<string, length 1 to 64>",
				}
			}[],
			"_count": {
				"likes": "<number, positive number>"
			},
			"isLiked": "<boolean>"
		}[]
	}
	```

---

## 게시글

```plain
[GET] /posts/:id
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
			"id": "<number, positive integer>",
			"userId": "<number, positive integer>",
			"title": "<string, length 1 to 64>",
			"content": "<string, length 1 to 65535>",
			"createdAt": "<string, ISO 8601 Date and time in UTC format>",
			"medias": {
				"index": "<number, positive number>",
				"media": {
					"id": "<number, positive number>",
					"name": "<string, hex encoded and length 128>",
					"type": "<string, length 3>",
					"userId": "<number, positive number>",
					"isImage": "<boolean>",
					"createdAt": "<string, ISO 8601 Date and time in UTC format>"
				}
			}[],
			"categories": {
				"category": {
					"id": "<number, positive integer>",
					"name": "<string, length 1 to 64>",
				}
			}[],
			"_count": {
				"likes": "<number, positive number>"
			},
			"isLiked": "<boolean>"
		}
	}
	```

---

## 게시글 수정

```plain
[PATCH] /posts/:id
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

#### Body

|key|type|description|
|---|---|---|
|title|string|최소 1자 최대 64자의 길이 제한이 있는 플레인 텍스트 형식의 문자열입니다|
|content|string|최소 1자 최대 65535자의 길이 제한이 있는 플레인 텍스트 형식의 문자열입니다|
|mediaIds|number[]|자연수로 이루어진 배열입니다|
|categoryIds|number[]|자연수로 이루어진 배열입니다|

### Response

#### 200

- 성공
	```json
	{
		"status": "success",
		"data": {
			"id": "<number, positive integer>",
			"userId": "<number, positive integer>",
			"title": "<string, length 1 to 64>",
			"content": "<string, length 1 to 65535>",
			"createdAt": "<string, ISO 8601 Date and time in UTC format>",
			"medias": {
				"index": "<number, positive number>",
				"media": {
					"id": "<number, positive number>",
					"name": "<string, hex encoded and length 128>",
					"type": "<string, length 3>",
					"userId": "<number, positive number>",
					"isImage": "<boolean>",
					"createdAt": "<string, ISO 8601 Date and time in UTC format>"
				}
			}[],
			"categories": {
				"category": {
					"id": "<number, positive integer>",
					"name": "<string, length 1 to 64>",
				}
			}[],
			"_count": {
				"likes": "<number, positive number>"
			},
			"isLiked": "<boolean>"
		}
	}
	```

#### 400

- 존재하지 않는 미디어
	```json
	{
		"status": "fail",
		"data": {
			"title": "Invalid mediaIds"
		}
	}
	```

- 미디어 개수 초과
	```json
	{
		"status": "fail",
		"data": {
			"title": "Too many mediaIds"
		}
	}
	```

- 존재하지 않는 카테고리
	```json
	{
		"status": "fail",
		"data": {
			"title": "Invalid categoryIds"
		}
	}
	```

#### 401

- 요청하는 유저와 작성자 불일치 또는 요청하는 유저와 미디어 업로더 불일치
	```json
	{
		"status": "fail",
		"data": {
			"title": "Unauthorized user"
		}
	}
	```

#### 409

- 이미 사용중인 미디어
	```json
	{
		"status": "fail",
		"data": {
			"title": "Duplicated media usuage"
		}
	}
	```

---

## 게시글 삭제

```plain
[DELETE] /posts/:id
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