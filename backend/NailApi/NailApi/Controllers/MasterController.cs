using NailApi.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace NailApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MasterController : ControllerBase
    {
        ApplicationDbContext _context;
        public MasterController(ApplicationDbContext context)
        {
            _context= context;
        }
        [HttpGet("GetAllStates")]
        public IActionResult GetAllStates()
        {

            // Simulate fetching data from a database or service
            var states = _context.States.ToList();
            return Ok(states);
        }
        [HttpGet("GetAllDistictByStateId/{stateId}")]
        public IActionResult GetAllDistictByStateId(int stateId) 
        { 
            var districts = _context.Districts.Where(x=>x.StateId == stateId).ToList();
            return Ok(districts);
        }
        [HttpGet("GetAllCitiesByDistrictId/{districtId}")]
        public IActionResult GetAllCitiesByDistrictId(int districtId) 
        { 
            var cities = _context.Cities.Where(x=>x.DistrictId == districtId).ToList();
            return Ok(cities);
        }
        [HttpGet("GetAllCategories")]
        public IActionResult GetAllCategories()
        {
            var categories = _context.Categories.ToList();
            return Ok(categories);
        }
    }
}
