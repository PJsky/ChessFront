# Table of Contents
1. [Overview](#1-overview)     

2. [Application design](#2-application-design)

	2.1. [Functionality](#21-functionality)
	
	2.2. [Database](#22-database)

3. [Technology](#3-technology)

	3.1. [Frontend](#31-frontend)
	
	3.2. [Backend](#32-backend)
	
	3.3. [Other](#33-others)
	
4. [Implementation](#4-implementation)

	4.1. [Frontend problems](#41-frontend-problems)
	
	&nbsp; 4.1.1. [Identification system](#411-identification-system)
	
	&nbsp; 4.1.3. [HTTP communication with backend](#412-http-communication-with-backend)
	
	&nbsp;  4.1.3. [Realtime communication](#413-realtime-communication)
	
	&nbsp;  4.1.4. [Gameplay](#414-gameplay)
	
	&nbsp; 4.1.5. [Game replay](#415-game-replay)
		
	4.2. [Backend problems](#42-backend-problems)
	
	&nbsp; 4.2.1.[Chess game core](#421-chess-game-core)
	
	&nbsp; 4.2.2.[Functional programming idea](#422-functional-programming-idea)
	
	&nbsp; 4.2.3.[Interchangable components](#423-interchangable-components)
	
	&nbsp; 4.2.4.[Test Driven Development](#424-test-driven-development)
	
	&nbsp; 4.2.5.[Web API](#425-web-api)
	
	&nbsp; 4.2.6.[SignalR communication](#426-signalr-communication)

6. [Conclusions](#5-conclusions)
	
	5.1.[Goals met](#51-goals-met)
	
	5.2.[Possible improvements of development](#52-possible-improvements-of-development)
	
	5.3.[Possible additions to application](#53-possible-additions-to-application)



# 1. Overview

The application is a sum of 2 parts:

 1. **Frontend** - Written in javaScript with a help of React
 2. **Backend** - Written in C# with a help of ASP .NET Core
 
 Application allows to create and play a chess game. Game is played in realtime thanks to WebSockets provided by SignalR. This technology allows to create two-way communication between the client and the server. Such connection makes sending messges from server to client without clients request possible. Thus we may send data from server and then it may notify all the clients subscribing for such information

# 2. Application design
The process of designing this application allowed to create a vision of an application upon completion. To get that correctly I had to decide upon neccessary functionalities and how the data stored will need to look

## 2.1 Functionality

During the designing process specific functionalities that had to be created came up. 
They were:
 - Creating an account and logging into it
 - Creating and playing basic chess games
 - Spectating live games
 - Rewatching games after they have ended
 - Looking up a person and potentially adding him/her as a friend
 - Accepting/Rejecting friend invitation
 - Having access to a chronologically sorted list of events (eg. game lost/won by a friend)
 - Being notified of event if it happens in given moment
 

## 2.2 Database
To have a presistent data which would allow to complete several of functionalities listed I decided to create a simple database. That database had to store the following:

 - **Users** - Saving registered users and their passwords
 
	
|  Column Name| Data Type |
|---|--|
|ID| int |
|Name| varchar|
|PasswordHash|varchar|
|PasswordSalt|varchar|

 - **Games** - Storing data of who is playing the game, game timer and start/finish date
	
|  Column Name| Data Type |
|---|--|
|ID| int |
|PlayerWhiteID| int|
|PlayerBlackID|int|
|WinnerID|int|
|MovesList|varchar|
|GameTime|int|
|TimeGain|int|
|StartedDate|date|
|FinishedDate|date|
 - **Friendships** - Saving data of who is friends with who
	
|  Column Name| Data Type |
|---|--|
|User1ID| int |
|User2ID| int|
|IsAccepted|bit|



# 3. Technology<a name="technology">
Having a simple design makes certain ideas come up. To complete them I could choose proper tools.

## 3.1 Frontend
Following technologies were used for the frontend part of the application: 

 - **Visual Studio Code**
 Preferred code editor used to write front end code of this application
 - **React**
 JavaScript library for building intearactive UI
 - **Redux**
 State container used in pair with react
 - **SASS**
 CSS language extension (CSS preprocessor)
 - **Axios**
 JavaScript HTTP client helping with handling of requests and responses
 - **SignalR**
 Library used to create two-way communication between client and server
 - **Formik**
 Popular library which helps with creation and handling of forms
 - **Yup**
 JavaScript schema builder which allows for fast and easy frontend validiation

## 3.2 Backend
- **Visual Studio 2019**
Preferred IDE for C# projects
- **ASP .NET Core**
Web framework used by C# deveopers to build web applications
- **Entity Framework**
Popular ORM framework which makes communication with database through backend simple and easy
- **LINQ (Language INtegrated Query)** 
Presents functions that represents SQL queries against data
- **SingalR**
Library creating connection between client and server which allows server to send data to client without any requests

## 3.3 Others

 - **MSSQL Management Studio**
RDBMS(**R**elational **D**ata**b**ase **M**anagement **S**ystem) used in the project 
- **Adobe XD**
User Experience Design Tool used. Allows to mock how a website will look and behave

 

# 4. Implementation
This chapter describes how exactly the application works from both client and server side.
## 4.1 Frontend problems 
This section describes problems that were resolved during the frontend developement and use of backend APIs for that purpose.
## 4.1.1 Identification system
System that most of modern web applications must have. It allows for a simple registration and login through a form

![Login and Register](https://i.ibb.co/F5V2Mzd/1-Login-Register.png) 
If valid data is given pressing the form button (Log in/ Create Account) will send a POST request to a backend with a given data. Upon successful registration/log in client receives a JWT token to preserve in localstorage that will be used as a mean of user identification. 
If user tries to send invalid data one of two things will occur. Firstly he may not pass frontend validation. 

![Frontend validation](https://i.ibb.co/K7dwZ6q/2-Login-Register-Validation.png)
Client will be given simple prompts as to what he needs to change in order to send this form.
Frontend validation was made thanks to combination of Formik and Yup. Formik is the most popular library for creating forms when using React. It takes care of proper data binding, component updates and allows to validate its data. Yup is a framework that is used in pair with Formik. It gives creators opportunity to create simple, short validation schemas like this one:

```javaScript
const LoginSchema = Yup.object().shape({
name:  Yup.string()
.min(6,"Username is too short")
.max(50, "Username is too long")
.required('Username is required'),

password:  Yup.string()
.min(6, "Password is too short")
.max(50, "Password is too long")
}) 
```    
If client directly sends a POST request to server it will either respond with similar fix suggestions or with a bad request stating that this name is taken. 

## 4.1.2 HTTP communication with backend
The simpliest most common form of using getting and using data from backend is through HTTP protocol. This application using Axios library which allows us to send simple requests. Most of mechanisms in this application are made with simple GET and POST requests send to a backend. GETs are used mostly to aquire data from backend and then it is saved on frontend and displayed on a webpage. POSTs use is to send data to create new objects (eg. create new account/game). For example main page makes simple GET request to receive a list of games  
```javaScript
axios.get(global.BACKEND + "/game/getFreeGames",
{
headers:{
"Authorization":  "Bearer " + window.localStorage.getItem("access_token")
}
})
.then((response)=>{
setListOfGames(response.data);
})
```
And so they are displayed

![GET display](https://i.ibb.co/gJPVNYJ/3-GET.png)
Those same ideas are used to search for people and add them as friends. Navbar contains a lookup feature where u may type the name of a friend or its part to find him

![Navbar lookup](https://i.ibb.co/s5QrgjV/3-2Navar.png)
Once the form is submited client is moved to a list of searches matched to this particular string of characters
![Search results](https://i.ibb.co/0yKVLZG/3-3search.png)
Here client may choose if he wants to add someone. After someone has send a request the receiving party may either accept it or reject the invitation

![Response to invitation](https://i.ibb.co/60r4wX9/3-4response.png)


## 4.1.3 Realtime Communication
This application allows to add friends and know when they start/end games. Such systems makes it easy for a client to watch his friends games or rewatch them after they have ended.
SignalR was used to make such connection between client and server. When one player begins/finishes a game a promt appears on navbar

![Event prompt](https://i.ibb.co/cJfkBSb/4-Prompt.png) 
This communication was also used to make playing chess and spectating those games possible.
## 4.1.4 Gameplay 
Each chess games needs several things to begin. Firstly we need to decide on how much time each player is allowed and how much time they will gain per move/turn

![New game modal](https://i.ibb.co/FnwXZJn/5-New-Game-Modal.png)
For example we create a game with 180 seconds and 10 seconds time gain per turn.
Then the game is created and other user may join it by selecting it in the list presented in chapter 4.1.2. This is how a gameroom looks when both players joined

![Gameroom](https://i.ibb.co/FHrmjDT/6-2-Gameroom.png)
Once a player will make a move game will begin and prompt will be send to all of their friends that the game has begun. From the player perspective we see that the move has been made and the timers start to tick. The black player sees the board upside down and this is how first two moves would look from his point of view

![First move](https://i.ibb.co/LPyRQqq/7-1-Firstmove.png)

![Second move](https://i.ibb.co/SXNWLbq/8-2-Sec-Move.png)
After a move made player time goes up by "time gain" chosen upon creation. Those timers are implemented on both client side and server side. Whenever move is made client not only receives the update of a board state but also how much time each of players have left. 
As a players friend we see the prompt and may find that the game has begun on a event feed. We can begin to spectate the game and see what each of those players sees

![Event](https://i.ibb.co/7Jpq88M/9-Spectate.png)

![Spectators view](https://i.ibb.co/QQ10Jtk/10-2-Join-As-Spectator.png)
There are currently 2 ways to finish the game. Both of them are by winning. You can win either by checkmate or by your opponents time running out.
## 4.1.5 Game replay
After the game has ended players and spectators will see a modal saying who won

![EndGame modal](https://i.ibb.co/syTv1xd/11-Game-End.png)
Here client may choose whether to rewatch the game or quit to the main page. If client chooses to rewatch the game he will be moved to a room where he easly replay all the moves made. Same room may be accessed from match history (if you were the player) or thourgh history feed (if you are friend of the player)

![Replay room](https://i.ibb.co/9qfj9DT/12-Gamereplay.png)
In this room a client may click + and minus button to change turns. The + button takes game to the next move and the - button to the previous one. For example he may check the 3rd turn

![enter image description here](https://i.ibb.co/swJYwmW/13-Replay.png)

## 4.2 Backend problems
This chapter contains description of how backend problems were solved. Most of it shows problems that were solved before the creation of frontend begun. Big part of backend has been built without UI so no frontend was needed.
## 4.2.1 Chess game core
The very first piece of code that was developed had to do with chess pieces, their movement, a board to place them on and a game which would contain information of who is the winner and whose turn it is. At the very beggining the decision was made to write the core of an application with a TDD approach. And so IChessPiece interface was created
```csharp
public interface IChessPiece
    {
        string Name { get; }
        bool wasMoved { get; }
        ColorsEnum Color { get; set; }
        Position Position { get; }
        bool Move(int columnPosition, int rowPosition, List<IChessPiece> chessPiecesOnBoard = null);
        bool IsMovePossible(int columnPosition, int rowPosition, List<IChessPiece> chessPiecesOnBoard = null);
    }
``` 
This way we can use polymorphism and treat different objects/chess pieces as a IChessPiece. Then it was noted that alot of the pieces logic was the same and so abstract class implementing  it came to be
```csharp
public abstract class StandardChessPiece : IChessPiece
    {
        public abstract string Name { get; }
        public bool wasMoved { get; protected set; } = false;
        public StandardChessPiece(int colorId, int columnPosition, int rowPosition)
        {
            Color = (ColorsEnum)colorId;
            Position = new Position(columnPosition, rowPosition);
        }

        public StandardChessPiece(int colorId, string position)
        {
            Color = (ColorsEnum)colorId;
            Position = new Position(position);
        }
        public ColorsEnum Color { get; set; }
        public Position Position { get; protected set; }
        public virtual bool Move(int columnPosition, int rowPosition, List<IChessPiece> chessPiecesOnBoard = null)
        {
            if (MoveVerifier.Verify(this, columnPosition, rowPosition, chessPiecesOnBoard)) 
            { 
                Position.ChangePosition(columnPosition, rowPosition);
                return true;
            }
            return false;
        }

        public virtual bool IsMovePossible(int columnPosition, int rowPosition, List<IChessPiece> chessPiecesOnBoard = null)
        {
            if (MoveVerifier.Verify(this, columnPosition, rowPosition, chessPiecesOnBoard))return true;
            return false;
        }

        protected abstract IChessMoveVerifier MoveVerifier { get; set; }

    }
```
Then each of classes representing chess pieces could inherit from this class. In the code above, at the very bottom we have see MoveVerifier which has to be overriden. Classes implementing IChessMoveVerifier are the ones that describe whether a move can be made by a certain piece. 
```csharp
public interface IChessMoveVerifier
    {
        bool Verify(IChessPiece chessPieceMoved,
                    int finalColumnPosition, int finalRowPosition,
                    List<IChessPiece> chessPiecesList = null);
    }
```
It was made this way so that chess piece class would only had to care about its construction and all the movement logic was implemented in those verifiers. This approach makes it easy to create new classes which could use previously created movement patterns (e.g Queen has a movement of a Rook and Bishop at the same time). The other thing worth noting is that this class was written in a way that would create the possibility of moving the piece before even having the chess board. Thus it was possible to write simple and clean tests (or rather it came out this way because TDD was implemented and the need to write tests made classes look this way)
Next move was to write a class that would represent game board and give restrictions about a movement (piece can't leave the board). To populate the board a factory class was created which would contain a function returning chess pieces in proper positions. Implementing interface for this class was also important for test suite. 
After creating chess board the game object came to be. Game object originally had to do a couple of things: verify if move can be made by current player, contain player object, verify win condition and end game on checkmate. Such a class was looking bloated and so the GameTimer class came to be which would be used to contain players and change turns. Now the game object only had to verify if the move is possible and if it ends the game (additionally interfaces were used there to make new conditions possible without modifying code).
The last thing that was needed was a game replayer. An element that given a string of moves and a game it would make all of them and give us a game object with properly positioned pieces (more about replayer in chapter 4.2.2).
## 4.2.2 Functional programming idea
After reading "clean architecture" by Bob Martin I decided to explore the function programming paradigm a bit. Reading some articles and watching some videos made me realize that I may implement similar mechanism in the application I currently work on. I heard that many systems may never change their data. They would simply store all changes and apply them on the starting data to get what is needed when the function is called (e.g. GitHub allows to check every commit, saves every change made). I came to a conclusion that my database entity representing game could save only the moves made and not the current state of pieces. This has influenced the application just the way it was expected to. Firstly there was no need store the state of the game because each time it was needed we could recreate it. Secondly it made rewatching game truly easly to implement.  
## 4.2.3 Interchangable components
Other piece of knowledge that I gained from "clean architecture" was the idea of creating loosely coupled, intechangable components. Presented application was a place of practice where this idea was explored by me. The logic behind chess game was put inside its own library  and when it was finished it had no interface given. Because there was no interface it was possible to make any interface work. The goal was to make a website to play chess but first I decided to test it out in a console. Given a little time I managed to create a simple console app that would take our move input and allowed me to play the game. Here is a presentation of how 2 moves would like in console

![Console version](https://i.ibb.co/pLYsD4q/14-Console-game.png)
Knowing that the game can be played and works correctly (as expected from tests) I proceeded to work on a web version. First step was to create a database so that we may have persistant data. This time after being inspired to try and decouple components I began working on a database access which could be changed at any time. The database access library was created and I decided to use Entity Framework. For each class which would access database an interface like the one below was made
```csharp
public interface IUserDataAccess
    {
        User AddUser(User user, string password);
        User GetUser(int id);
        User GetUser(string userName);
        List<User> GetUsers(Func<User, bool> filter = null);
        bool RemoveUser(int userId);
        bool RemoveUser(string userName);
        bool RemoveUser(User userToDelete);
        bool MakeFriends(User sender, User receiver);
        bool RespondToFriendAdd(User sender, User receiver, bool isAccepted);
        bool RemoveFriend(User friendOne, User friendTwo);
        List<Friendship> GetAllFriends(User person);
        List<Friendship> GetAllFriends(int personID);
    }
```
This way if i had to change database to any other I could simply implement those functions that interface describe and use it in project. This way whole database would change but the code that uses it wouldn't have to be modified. The other problem that had to be solved was making entity framework operate on interface so that we may not only use different IDataAccess implementations but also be able to change database in the entity framework version
```csharp
public interface IDbContext
    {
        DbSet<User> Users { get; set; }
        DbSet<Game> Games { get; set; }
        DbSet<UserGames> UserGames { get; set; }
        DbSet<Friendship> Friendships { get; set; }
        int SaveChanges();
        Task<int> SaveChangesAsync();

    }
```
The context of the database had to implement this interface. It makes it so that we can specify that the class of the given interface will be injected without explicitly saying which class.
 

## 4.2.4 Test Driven Development
At the beggining application was developed without any interface for user to interact with. All code written had to pass the designated unit tests. Only after the whole core of a project (chess game) has been completed the first user interface (console app above) was implemented.
Before any code was written I would create a test for it and make the simpliest case for it to pass. Then I had to make the class so that it would pass the test. After that I would repeat proccess of writting tests and then classes to pass them. I found out that this way made the code better in few ways:

 - Code is easly testable. It is obvious that if the test is written in the first place then it is easy to write it
 - Components naturally were decoupled. Creating tests first made me to use polymorphism so that I have easier time testing (e.g. implementing interfaces and creating fakes so that they work in a particular manner needed for a test). 

Tests were written in XUnit and they followed the AAA (Arrange Act Assert) pattern
```csharp
		///Deciding data for a given test inside the InlineData attribute
	    [Theory]
        [InlineData(10,10,20,20)]
        [InlineData(-10,-10,-20,-20)]
        [InlineData(10,-10,20,-20)]
        [InlineData(-10,10,-20,20)]
        public void Verify_OtherPieceBlocksTheWay_ReturnsFalse(int blockingColumnPosition, int blockingRowPosition,
                                                             int finalDestinationColumn, int finalDestinationRow)
        {
	        //Arrange
            IChessPiece bishop = new Bishop(0, 5, 5);
            List<IChessPiece> otherPieces = new List<IChessPiece>();

            otherPieces.Add(new Bishop(0, blockingColumnPosition, blockingRowPosition));
            otherPieces.Add(new Bishop(0, 10, 9));

            IChessMoveVerifier bishopMoveVerifier = new BishopMoveVerifier();
			
			//Act
            var result = bishopMoveVerifier.Verify(bishop, finalDestinationColumn, finalDestinationRow, otherPieces);
			
			//Assert
            Assert.False(result);
        }
```
Those simple tests were used throught the core of the game. Other worthy of showing tests were the ones made on database. Thanks to the fact that the database was decoupled I could easly create a testing database very similar to the production one. Testing database would implement one more interface which would state that there is a function for a database reset
```csharp
public class ChessAppTestingContext : DbContext, IDbContext, ITestingDbContext
    {
        ...The common things for EF DbContext
        
        //New function
        public void ClearDatabase()
        {
            this.Database.ExecuteSqlRaw("DELETE FROM [Games]");
            this.Database.ExecuteSqlRaw("DBCC CHECKIDENT ([Games], RESEED, 0)");

            this.Database.ExecuteSqlRaw("DELETE FROM [Users]");
            this.Database.ExecuteSqlRaw("DBCC CHECKIDENT ([Users], RESEED, 0)");
        }

    }
```
This way we could easly run test on database. We would simply use reset function in the setup of the test. The tests covered both data access and game logic. There is a total of 221 tests and all of them pass
## 4.2.5 Web API
Final step to make our applications possibilities available on web was creating a web API. This step presented nothing out of ordinary. Controllers were created, objects for data access were injected into them to inverse dependency. This step was mostly making all of the code created beforehand work with the API interface. The only new problem that appeared when trying to make games online possible was user identification. Knowing that the application frontend and backend will be hosted separetly and communicate via API I decided to use JWT (Json Web Tokens). I created a simple registration and login system that would use hash and salt to add to the apps security
```csharp
internal class PasswordHasher
    {
        public void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            if (string.IsNullOrWhiteSpace(password)) throw new Exception("Password cannot be null or whitespace only");
            
            using(var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            }
        }

        public bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            if (string.IsNullOrWhiteSpace(password)) throw new Exception("Password cannot be null or whitespace only");
            if (passwordHash.Length != 64) throw new ArgumentException("Invalid hash length");
            if (passwordSalt.Length != 128) throw new ArgumentException("Invalid salt length");

            using (var hmac = new HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
                
                for (int i = 0; i < computedHash.Length; i++)
                    if (computedHash[i] != passwordHash[i]) return false;
            }

            return true;
        }
    }
```
This class allowed to save encrypted password to a database and check if the login data is valid. After login a user should get a token which would be his identificator. Then I created a class that would generate it so that I may pass it to a user within a API response
```csharp
public static class JWTGenerator
    {
        public static string GetToken(string secret, string userID) 
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, userID)
                }),
                Expires = DateTime.UtcNow.AddDays(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);
            return tokenString;
        }
    }
   ```
    Thanks to that the client can store token and use it as a proof of who he is
## 4.2.6 SignalR communication
At this point everything was working as it was meant to. The only thing left to create was the SignalR hubs needed for a realtime communication. This technology was fairly simple to implement. There are only few neccessary thing to know to make idea such as mine work. Firstly I have to create a method which sends certain data with a same name as on frontend. For example
```csharp
	public async Task SendData(string message)
        {
            await Clients.All.SendAsync("ReceiveData", data);
        }
```
```javaScript
socket.on("ReceiveData", (data) => {
	store.dispatch({
	type:  "SET_DATA",
	payload:  data
	});
});
```
Secondly I could use premade methods and override them to implement additional functionality whenever someone joins/disconnects 
```csharp
public override Task OnConnectedAsync()
        {
            var userDataAccess = new UserDataAccess();
            var userID = Context.User.Identity.Name;
            List<int> friendsIDs = new List<int>();
            if(userID != null)
                friendsIDs = userDataAccess.GetAllFriends(Int32.Parse(userID))
                                           .Select(f => f.User1ID == Int32.Parse(userID)? f.User2ID : f.User1ID)
                                           .ToList();

            for(int i = 0; i < friendsIDs.Count; i++)
            {
                Groups.AddToGroupAsync(Context.ConnectionId, "FriendsWith_" + friendsIDs[i]);
            }
            return base.OnConnectedAsync();
        }
```
The third idea that I had to explore was saving users indentity. By default SignalR does not store the users identities and connection IDs. Application described in this document needed to know who is playing who. I decided that I would create a list of players and whenever someone begins playing the game their identity is saved with the game ID so that we may recognize who is dueling
```csharp
connectionList.Add(new ConnectedUserGroup
                {
                    ConnectionID = Context.ConnectionId,
                    UserID = Int32.Parse(userID),
                    GameRoomID = Int32.Parse(gameRoomID)
                });
```
And last problem that came out after I was able to implement gameplay on website was creating a timer that would be displayed properly for players. I decided on using a similar solution to the one above. I created a dictionary where its key would be game ID and value would be an object which has all the logic and data needed to be a game timer. At the beggining of the game I would add a timer bound to the game and start it
```csharp
GameTimersDictionary.Add(gameRoomID, gameFromDb.PlayerWhite.Name, gameFromDb.PlayerBlack.Name, gameFromDb.GameTime, gameFromDb.TimeGain);
gameTimers[gameRoomID].StartGame();
```
The timer itself would have starting time and time gain for the game as well as names of the players to satisfy the need for identification in future. The timer would use stopwatch classes interchangebly to count how much time has passed on each turn and set the amount left to the timer which on timeout would trigger the end of the game notification
```csharp
public void ChangeTurn()
        {
            if (stopwatchWhite.IsRunning)
            {
                //End turn and add time to white
                stopwatchWhite.Stop();
                if(!isFirstTurn)
                    whiteSecondsLeft += timeGain;
                isFirstTurn = false;
                stopwatchBlack.Start();

                //Release used timer resources and create a new one
                endTimer.Close();
                endTimer = new Timer(BlackTime*1000);
                endTimer.Start();
                endTimer.Enabled = true;
                endTimer.Elapsed += EndOnTimeOnBlack;
            }else if (stopwatchBlack.IsRunning)
            {
                //End turn and add time to black
                stopwatchBlack.Stop();
                blackSecondsLeft += timeGain;
                stopwatchWhite.Start();

                //Release used timer resources and create a new one
                endTimer.Close();
                endTimer = new Timer(WhiteTime*1000);
                endTimer.Start();
                endTimer.Enabled = true;
                endTimer.Elapsed += EndOnTimeOnWhite;
            }
        }
```
```csharp
private void EndOnTimeOnWhite(Object source, ElapsedEventArgs e)
        {
            hubContext.Clients.Groups("gameRoom_" + groupID).SendAsync("ReceiveWinner",   new { winner = blackWinner});
            GameDataAccess gameDataAccess = new GameDataAccess();
            var game = gameDataAccess.GetGame(groupID);
            int winnerID = (int)game.PlayerBlackID;
            gameDataAccess.DecideWinner(groupID, winnerID);
            gameDataAccess.FinishGame(groupID);
            CommunicateEnd((int)game.PlayerWhiteID, (int)game.PlayerBlackID);
            endTimer.Stop();
            endTimer.Close();
        }
```

# 5. Conclusions
## 5.1 Goals met
At the beggining the application was meant to allow for a simple game of chess. It evolved into a web application which allows to not only play games but also rewatch and spectate them. I wanted to implement what I have learned about clean architecture and I tried my best. It improved the loosly coupledness and testability of my code

## 5.2 Possible improvements of development
There were many things that I belive I could have done better. During the days I was less motivated I created and worse quality of code which I tought I would refactor in future. It never happened. I would also like to create a more complete suite of tests including some controller and signalR hubs tests

## 5.3 Possible additions to application

Application could also have a bit more. In future any of those things may be added:

 - Draw system for a game. There are many ways to draw a game that could be implemented
 - Surrender possibility
 - Castling 
 - In game chatroom
 - Dark mode
 - Add in game voice recognition. Saying "A2" then "A4" would trigger response of AI to confirm move upon which it would be made. Possibly made with Alan AI

 
