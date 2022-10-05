# Glint

- ***_***
	- ***auth*** ([GET](auth))
		- email ([GET](auth?id=이메일-인증))
		- login ([POST](auth?id=로그인))
		- token ([POST](auth?id=토큰-재생성))
	- ***users*** ([POST](users?id=유저-생성), [GET](users?id=모든-유저))
		- :id ([GET](users?id=유저), [PATCH](users?id=유저-수정), [DELETE](users?id=유저-삭제))
			- ***schedules*** ([POST](users/-id/schedules?id=일정-생성), [GET](users/-id/schedules?id=모든-일정))
				- :id ([GET](users/-id/schedules?id=일정), [PATCH](users/-id/schedules?id=일정-수정), [DELETE](users/-id/schedules?id=일정-삭제))
				- successRate ([GET](users/-id/schedules?id=유저-성공률))