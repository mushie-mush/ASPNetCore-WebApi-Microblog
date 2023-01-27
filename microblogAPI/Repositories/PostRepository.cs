using Dapper;
using microblog.Models;
using System.Data;
using System.Data.SqlClient;

namespace microblog.Repositories
{
    public class PostRepository
    {
        private readonly string _connectionString;

        public PostRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public IDbConnection Connection
        {
            get
            {
                return new SqlConnection(_connectionString);
            }
        }

        public IEnumerable<PostModel> GetAllPost()
        {
            using (IDbConnection conn = Connection)
            {
                string query = @"SELECT pl.*, u.Username FROM (SELECT p.*, l.LikesNumber FROM posts p LEFT JOIN (SELECT PostID, COUNT(DISTINCT UserID) AS LikesNumber FROM likes GROUP BY PostID) l ON p.PostID = l.PostID) pl LEFT JOIN users u ON pl.UserID = u.UserID WHERE u.Username <> 'NULL' ";

                conn.Open();
                var output = conn.Query<PostModel>(query);

                return output;
            }
        }

        public IEnumerable<PostModel> GetAllPostByUser(int userId)
        {
            using (IDbConnection conn = Connection)
            {
                string query = @"SELECT pl.*, u.Username FROM (SELECT p.*, l.LikesNumber FROM posts p LEFT JOIN (SELECT PostID, COUNT(DISTINCT UserID) AS LikesNumber FROM likes GROUP BY PostID) l ON p.PostID = l.PostID WHERE UserID = @userId) pl LEFT JOIN users u ON pl.UserID = u.UserID WHERE u.Username <> 'NULL' ";

                conn.Open();
                var output = conn.Query<PostModel>(query, new { userId });

                return output;
            }
        }

        public PostModel GetPostById(int postId)
        {
            using (IDbConnection conn = Connection)
            {
                string query = @"SELECT pl.*, u.Username FROM (SELECT p.*, l.LikesNumber FROM posts p LEFT JOIN (SELECT PostID, COUNT(DISTINCT UserID) AS LikesNumber FROM likes GROUP BY PostID) l ON p.PostID = l.PostID WHERE p.PostID = @postId) pl LEFT JOIN users u ON pl.UserID = u.UserID WHERE u.Username <> 'NULL' ";

                conn.Open();
                var output = conn.Query<PostModel>(query, new { postId }).FirstOrDefault();

                return output;
            }
        }

        public void AddPost(PostModel post)
        {
            using (IDbConnection conn = Connection)
            {
                string query = @"INSERT INTO posts (Title, Body, UserID, [Datetime]) VALUES (@title, @body, @userId, @dateTime)";

                conn.Open();
                conn.Execute(query, post);
                conn.Close();
            }
        }

        public void UpdatePost(PostModel post)
        {
            using (IDbConnection conn = Connection)
            {
                string query = @"UPDATE posts SET Title = @title, Body = @body, [Datetime] = @dateTime";

                conn.Open();
                conn.Execute(query, post);
                conn.Close();
            }
        }

        public void DeletePost(int postId)
        {
            using (IDbConnection conn = Connection)
            {
                string query = @"DELETE FROM posts WHERE PostID = @postId";

                conn.Open();
                conn.Execute(query, new { postId });
                conn.Close();
            }
        }

        public void LIkePost(int postId, int userId)
        {
            using (IDbConnection conn = Connection)
            {
                string likesQuery = @"INSERT INTO likes (PostID, UserID) VALUES (@postId, @userId) WHERE NOT EXISTS ( SELECT * FROM likes WHERE PostID = @postId AND UserID = @userId";

                conn.Open();
                conn.Execute(likesQuery, new
                {
                    postId,
                    userId
                });
                conn.Close();
            }
        }
    }
}
