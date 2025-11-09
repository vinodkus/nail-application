using NailApi.Data;
using NailApi.Dtos;
using NailApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace NailApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<EmployeeController> _logger;
        public EmployeeController(ApplicationDbContext context, IWebHostEnvironment environment, ILogger<EmployeeController> logger)
        {
            _context = context;
            _environment = environment;
            _logger= logger;
        }
        //Get: api/employee
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees()
        {
            var employees = await _context.Employees.ToListAsync();
            if(employees == null || !employees.Any())
                return NotFound("No employees found.");
            return Ok(employees);
        }

        //Get: api/employee/1
        [HttpGet("{id}")]
        public async Task<ActionResult<Employee>> GetEmployee(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
                return NotFound($"Employee with ID {id} not found.");
            return Ok(employee);
        }

        //Post: api/employee      
        [HttpPost]
        public async Task<IActionResult> PostEmployee([FromForm] EmployeeDto dto)
        {
            string? fileName = null;
            if (dto.Image != null)
            {
                string uploadFolder = Path.Combine(_environment.WebRootPath, "employee");
                if (!Directory.Exists(uploadFolder))
                {
                    Directory.CreateDirectory(uploadFolder);
                }
                fileName = Guid.NewGuid().ToString() + Path.GetExtension(dto.Image.FileName);
                var filePath = Path.Combine(uploadFolder, fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.Image.CopyToAsync(stream);
                }
            }

            var employee = new Employee
            {
                Name = dto.Name,
                Role = dto.Role,
                StateId = dto.StateId,
                DistrictId = dto.DistrictId,
                CityId = dto.CityId,
                ImagePath = fileName
            };

            _context.Employees.Add(employee);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetEmployee), new { id = employee.Id }, employee);
        }


        //Put: api/employee/1
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEmployee(int id, Employee updatedEmployee)
        {
            if (id != updatedEmployee.Id)
                return BadRequest("Employee ID mismatch.");

            var existingEmployee = await _context.Employees.FindAsync(id);

            if (existingEmployee == null)
                return NotFound($"Employee with ID {id} not found.");

            // Update only the fields needed
            existingEmployee.Name = updatedEmployee.Name;
            existingEmployee.Role = updatedEmployee.Role;

            await _context.SaveChangesAsync();

            return NoContent();
        }
        // ✅ DELETE: api/employee/1
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
                return NotFound($"Employee with ID {id} not found.");

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

}