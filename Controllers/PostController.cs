using microblog.Models;
using microblog.Repositories;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace microblog.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogger _logger;
        private readonly PostRepository _postRepository;

        public PostController(IConfiguration config, ILogger<PostController> logger)
        {
            _config = config;
            _logger = logger;
            _postRepository = new PostRepository(_config.GetConnectionString("Default"));
        }
        [HttpGet]
        public IActionResult Get()
        {
            if (GetCurrentUserId() == 0)
            {
                return Unauthorized();
            }

            try
            {
                var output = _postRepository.GetAllPost();

                if (output == null)
                {
                    return NoContent();
                }

                return Ok(output);
            }
            catch (Exception)
            {

                return BadRequest();
            }

        }

        [HttpGet("{postId}")]
        public IActionResult Get(int postId)
        {
            if (GetCurrentUserId() == 0)
            {
                return Unauthorized();
            }

            try
            {
                var output = _postRepository.GetPostById(postId);

                if (output == null)
                {
                    return NoContent();
                }

                return Ok(output);
            }
            catch (Exception)
            {

                return BadRequest();
            }

        }

        [Route("user/")]
        [HttpGet]
        public IActionResult GetPostsByUser()
        {
            if (GetCurrentUserId() == 0)
            {
                return Unauthorized();
            }

            try
            {
                int currentUserId = GetCurrentUserId();
                var output = _postRepository.GetAllPostByUser(currentUserId);

                if (output == null)
                {
                    return NoContent();
                }

                return Ok(output);
            }
            catch (Exception) { return BadRequest(); }

        }

        [HttpPost]
        public IActionResult Post([FromBody] PostModel post)
        {
            if (GetCurrentUserId() == 0)
            {
                return Unauthorized();
            }

            try
            {
                if (ModelState.IsValid)
                {
                    post.Datetime = DateTime.Now;
                    post.UserID = GetCurrentUserId();

                    _postRepository.AddPost(post);
                    return Ok();
                }

                return BadRequest();
            }
            catch (Exception)
            {

                return BadRequest();
            }

        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] PostModel post)
        {
            if (GetCurrentUserId() == 0)
            {
                return Unauthorized();
            }

            try
            {
                if (ModelState.IsValid)
                {
                    post.Datetime = DateTime.Now;

                    _postRepository.UpdatePost(post);
                    return Ok();
                }

                return BadRequest();
            }
            catch (Exception) { return BadRequest(); }

        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            if (GetCurrentUserId() == 0)
            {
                return Unauthorized();
            }

            try
            {
                _postRepository.DeletePost(id);

                return Ok();
            }
            catch (Exception) { return BadRequest(); }

        }

        [Route("{postId}/like")]
        [HttpPost]
        public IActionResult LikePost(int postId)
        {
            if (GetCurrentUserId() == 0)
            {
                return Unauthorized();
            }

            try
            {
                int currentUserId = GetCurrentUserId();
                _postRepository.LIkePost(postId, currentUserId);

                return Ok();
            }
            catch (Exception) { return BadRequest(); }

        }

        private int GetCurrentUserId()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;


            if (identity != null)
            {
                var userClaims = identity.Claims;

                if (userClaims.Count<Claim>() == 0) return 0;

                var nameId = userClaims.FirstOrDefault(o => o.Type == ClaimTypes.Sid).Value;

                return int.Parse(nameId);
            }

            return 0;
        }

    }
}
