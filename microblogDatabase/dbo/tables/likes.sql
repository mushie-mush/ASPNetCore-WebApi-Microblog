﻿CREATE TABLE [dbo].[likes]
(
	[LikeID] INT IDENTITY(0,1) NOT NULL PRIMARY KEY,
	PostID INT NOT NULL,
	UserID INT NOT NULL
)