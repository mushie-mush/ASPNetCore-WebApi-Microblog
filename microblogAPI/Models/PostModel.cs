namespace microblog.Models
{
    public class PostModel
    {
        public int PostID
        {
            get; set;
        }

        public string Title
        {
            get; set;
        }

        public string Body
        {
            get; set;
        }

        public int LikesNumber
        {
            get; set;
        }

        public int UserID
        {
            get; set;
        }

        public string UserName
        {
            get; set;
        }

        public DateTime Datetime
        {
            get; set;
        }
    }
}

