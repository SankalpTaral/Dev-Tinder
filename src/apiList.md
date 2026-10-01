# DevTinder API'S

- # Generally Related to each other authRouter
- POST/signup
- POST/login
- POST/logout 

# profileRouter 
- GET/profile/view
- PATCH /profile/edit  -> to edit gender skills etc..
- PATCH/profile/password -> to edit password 

# connectionRequestRouter
<!-- - POST/request/send/interested/:userId
- POST/request/send/ignored/:userId -->
//Clubbed 
POST/request/send/:stauts/:userId
- POST/request/review/accepted/:requestId
- POST/request/review/rejected/:requestId

# userRouter 
- GET/user/connections
- GET/user/requests/recieved
-GET/user/feed api -> tinder behaviours its giving me list of 28 users not making an api call for every user ignore/interest so like its jst going to next user no api call is made to bring user



Status :ignored (pass), interested (like) , accepted , rejected 

