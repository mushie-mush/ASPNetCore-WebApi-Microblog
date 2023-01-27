using Dapper;
using microblog.Models;
using System.Data;
using System.Data.SqlClient;

namespace microblog.Repositories
{
    public class UserRepository
    {
        private readonly string _connectionString;

        public UserRepository(string connectionString)
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

        public void AddUser(UserModel user)
        {
            using (IDbConnection conn = Connection)
            {
                string query = @"INSERT INTO users (Username, Password, Email) VALUES (@Username, @Password, @Email)";

                conn.Open();
                conn.Execute(query, user);
                conn.Close();
            }
        }

        public UserModel GetUser(string email)
        {
            using (IDbConnection conn = Connection)
            {
                string query = @"SELECT * FROM users WHERE Email = @email";

                conn.Open();
                var output = conn.Query<UserModel>(query, new { email }).FirstOrDefault();

                return output;
            }
        }
    }
}
