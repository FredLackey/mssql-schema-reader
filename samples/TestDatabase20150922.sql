USE [TestDatabase20150922]
GO
/****** Object:  Schema [Communications]    Script Date: 9/22/2015 8:52:36 PM ******/
CREATE SCHEMA [Communications]
GO
/****** Object:  Schema [MemberManagement]    Script Date: 9/22/2015 8:52:36 PM ******/
CREATE SCHEMA [MemberManagement]
GO
/****** Object:  Schema [Resources]    Script Date: 9/22/2015 8:52:36 PM ******/
CREATE SCHEMA [Resources]
GO
/****** Object:  Table [Communications].[Message]    Script Date: 9/22/2015 8:52:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [Communications].[Message](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Uid] [uniqueidentifier] ROWGUIDCOL  NOT NULL,
	[FromAddress] [varchar](255) NOT NULL,
	[Subject] [varchar](255) NOT NULL,
	[AuditDeletedDate] [datetime] NULL,
	[AuditVersionDate] [datetime] NOT NULL,
	[AuditMemberUid] [bigint] NOT NULL,
 CONSTRAINT [PK_Message] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[BogusCode]    Script Date: 9/22/2015 8:52:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[BogusCode](
	[Code] [char](1) NOT NULL,
	[Name] [varchar](50) NOT NULL,
 CONSTRAINT [PK_BogusCode] PRIMARY KEY CLUSTERED 
(
	[Code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[BogusIdentifier]    Script Date: 9/22/2015 8:52:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[BogusIdentifier](
	[Uid] [uniqueidentifier] NOT NULL,
	[Value] [varchar](255) NOT NULL,
 CONSTRAINT [PK_BogusIdentifier] PRIMARY KEY CLUSTERED 
(
	[Uid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [MemberManagement].[Member]    Script Date: 9/22/2015 8:52:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [MemberManagement].[Member](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Uid] [uniqueidentifier] ROWGUIDCOL  NOT NULL,
	[UserName] [varchar](255) NOT NULL,
	[PassHash] [varchar](50) NOT NULL,
	[PassSalt] [varchar](50) NOT NULL,
	[AuditVersionDate] [datetime] NOT NULL,
	[AuditDeletedDate] [datetime] NULL,
 CONSTRAINT [PK_Member] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [MemberManagement].[MemberSignupRequest]    Script Date: 9/22/2015 8:52:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [MemberManagement].[MemberSignupRequest](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Uid] [uniqueidentifier] NOT NULL,
	[SignupRequestId] [bigint] NOT NULL,
	[MemberId] [bigint] NOT NULL,
 CONSTRAINT [PK_MemberSignupRequest] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [MemberManagement].[SignupRequest]    Script Date: 9/22/2015 8:52:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [MemberManagement].[SignupRequest](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[EmailAddress] [varchar](255) NOT NULL,
	[ConfirmationCode] [char](6) NOT NULL,
	[AuditDeletedDate] [datetime] NULL,
 CONSTRAINT [PK_SignupRequest] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  View [MemberManagement].[ActiveMember]    Script Date: 9/22/2015 8:52:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [MemberManagement].[ActiveMember]
AS
SELECT        Id, Uid, UserName, PassHash, PassSalt
FROM            MemberManagement.Member
WHERE        (AuditVersionDate IS NULL)

GO
/****** Object:  Index [IX_Message]    Script Date: 9/22/2015 8:52:36 PM ******/
CREATE NONCLUSTERED INDEX [IX_Message] ON [Communications].[Message]
(
	[AuditDeletedDate] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [IX_Message_1]    Script Date: 9/22/2015 8:52:36 PM ******/
CREATE NONCLUSTERED INDEX [IX_Message_1] ON [Communications].[Message]
(
	[FromAddress] ASC,
	[AuditDeletedDate] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [IX_Member]    Script Date: 9/22/2015 8:52:36 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_Member] ON [MemberManagement].[Member]
(
	[UserName] ASC,
	[AuditDeletedDate] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_MemberSignupRequest]    Script Date: 9/22/2015 8:52:36 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_MemberSignupRequest] ON [MemberManagement].[MemberSignupRequest]
(
	[SignupRequestId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_MemberSignupRequest_1]    Script Date: 9/22/2015 8:52:36 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_MemberSignupRequest_1] ON [MemberManagement].[MemberSignupRequest]
(
	[MemberId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_MemberSignupRequest_2]    Script Date: 9/22/2015 8:52:36 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_MemberSignupRequest_2] ON [MemberManagement].[MemberSignupRequest]
(
	[Uid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [IX_SignupRequest]    Script Date: 9/22/2015 8:52:36 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_SignupRequest] ON [MemberManagement].[SignupRequest]
(
	[EmailAddress] ASC,
	[AuditDeletedDate] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [Communications].[Message] ADD  CONSTRAINT [DF_Message_Uid]  DEFAULT (newid()) FOR [Uid]
GO
ALTER TABLE [MemberManagement].[Member] ADD  CONSTRAINT [DF_Member_Uid]  DEFAULT (newid()) FOR [Uid]
GO
ALTER TABLE [Communications].[Message]  WITH CHECK ADD  CONSTRAINT [FK_Message_Member] FOREIGN KEY([AuditMemberUid])
REFERENCES [MemberManagement].[Member] ([Id])
GO
ALTER TABLE [Communications].[Message] CHECK CONSTRAINT [FK_Message_Member]
GO
ALTER TABLE [MemberManagement].[MemberSignupRequest]  WITH CHECK ADD  CONSTRAINT [FK_MemberSignupRequest_Member] FOREIGN KEY([MemberId])
REFERENCES [MemberManagement].[Member] ([Id])
GO
ALTER TABLE [MemberManagement].[MemberSignupRequest] CHECK CONSTRAINT [FK_MemberSignupRequest_Member]
GO
ALTER TABLE [MemberManagement].[MemberSignupRequest]  WITH CHECK ADD  CONSTRAINT [FK_MemberSignupRequest_SignupRequest] FOREIGN KEY([SignupRequestId])
REFERENCES [MemberManagement].[SignupRequest] ([Id])
GO
ALTER TABLE [MemberManagement].[MemberSignupRequest] CHECK CONSTRAINT [FK_MemberSignupRequest_SignupRequest]
GO
EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPane1', @value=N'[0E232FF0-B466-11cf-A24F-00AA00A3EFFF, 1.00]
Begin DesignProperties = 
   Begin PaneConfigurations = 
      Begin PaneConfiguration = 0
         NumPanes = 4
         Configuration = "(H (1[40] 4[20] 2[20] 3) )"
      End
      Begin PaneConfiguration = 1
         NumPanes = 3
         Configuration = "(H (1 [50] 4 [25] 3))"
      End
      Begin PaneConfiguration = 2
         NumPanes = 3
         Configuration = "(H (1 [50] 2 [25] 3))"
      End
      Begin PaneConfiguration = 3
         NumPanes = 3
         Configuration = "(H (4 [30] 2 [40] 3))"
      End
      Begin PaneConfiguration = 4
         NumPanes = 2
         Configuration = "(H (1 [56] 3))"
      End
      Begin PaneConfiguration = 5
         NumPanes = 2
         Configuration = "(H (2 [66] 3))"
      End
      Begin PaneConfiguration = 6
         NumPanes = 2
         Configuration = "(H (4 [50] 3))"
      End
      Begin PaneConfiguration = 7
         NumPanes = 1
         Configuration = "(V (3))"
      End
      Begin PaneConfiguration = 8
         NumPanes = 3
         Configuration = "(H (1[56] 4[18] 2) )"
      End
      Begin PaneConfiguration = 9
         NumPanes = 2
         Configuration = "(H (1 [75] 4))"
      End
      Begin PaneConfiguration = 10
         NumPanes = 2
         Configuration = "(H (1[66] 2) )"
      End
      Begin PaneConfiguration = 11
         NumPanes = 2
         Configuration = "(H (4 [60] 2))"
      End
      Begin PaneConfiguration = 12
         NumPanes = 1
         Configuration = "(H (1) )"
      End
      Begin PaneConfiguration = 13
         NumPanes = 1
         Configuration = "(V (4))"
      End
      Begin PaneConfiguration = 14
         NumPanes = 1
         Configuration = "(V (2))"
      End
      ActivePaneConfig = 0
   End
   Begin DiagramPane = 
      Begin Origin = 
         Top = 0
         Left = 0
      End
      Begin Tables = 
         Begin Table = "Member (MemberManagement)"
            Begin Extent = 
               Top = 6
               Left = 38
               Bottom = 216
               Right = 220
            End
            DisplayFlags = 280
            TopColumn = 0
         End
      End
   End
   Begin SQLPane = 
   End
   Begin DataPane = 
      Begin ParameterDefaults = ""
      End
   End
   Begin CriteriaPane = 
      Begin ColumnWidths = 11
         Column = 1440
         Alias = 900
         Table = 1170
         Output = 720
         Append = 1400
         NewValue = 1170
         SortType = 1350
         SortOrder = 1410
         GroupBy = 1350
         Filter = 1350
         Or = 1350
         Or = 1350
         Or = 1350
      End
   End
End
' , @level0type=N'SCHEMA',@level0name=N'MemberManagement', @level1type=N'VIEW',@level1name=N'ActiveMember'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPaneCount', @value=1 , @level0type=N'SCHEMA',@level0name=N'MemberManagement', @level1type=N'VIEW',@level1name=N'ActiveMember'
GO
