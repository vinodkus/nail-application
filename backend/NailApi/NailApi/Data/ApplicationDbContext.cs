using NailApi.Models;
using Microsoft.EntityFrameworkCore;
using System.Net;
using NailApi.Dtos;

namespace NailApi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }
        public DbSet<Employee> Employees { get; set; } = null!;
        public DbSet<StateMaster> States { get; set; } = null!;
        public DbSet<DistrictMaster> Districts { get; set; } = null!;
        public DbSet<CityMaster> Cities { get; set; } = null!;
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Category> Categories { get; set; } = null!;
        public DbSet<Product> Products { get; set; } = null!;
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<ProductImage> ProductImages { get; set; }



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Add table renaming with prefix `nl_`
            modelBuilder.Entity<Employee>().ToTable("nl_Employees");
            modelBuilder.Entity<StateMaster>().ToTable("nl_States");
            modelBuilder.Entity<DistrictMaster>().ToTable("nl_Districts");
            modelBuilder.Entity<CityMaster>().ToTable("nl_Cities");
            modelBuilder.Entity<User>().ToTable("nl_Users");
            modelBuilder.Entity<Category>().ToTable("nl_Categories");
            modelBuilder.Entity<Product>().ToTable("nl_Products");
            modelBuilder.Entity<Customer>().ToTable("nl_Customers");
            modelBuilder.Entity<Order>().ToTable("nl_Orders");
            modelBuilder.Entity<OrderItem>().ToTable("nl_OrderItems");
            modelBuilder.Entity<Payment>().ToTable("nl_Payments");
            modelBuilder.Entity<ProductImage>().ToTable("nl_ProductImages");
            // Define keys (keep existing logic)
            modelBuilder.Entity<Order>().HasKey(o => o.OrderId);
            modelBuilder.Entity<Order>().Property(o=>o.Status).HasDefaultValue(OrderStatus.Pending); // Default status to 0 (Pending)
            modelBuilder.Entity<OrderItem>().HasKey(oi => oi.OrderItemId);
            modelBuilder.Entity<Payment>().HasKey(p => p.PaymentId); // ✅ ADD THIS LINE
                                                                     // Configure ProductImage entity if needed
            modelBuilder.Entity<ProductImage>(entity =>
            {
                entity.HasOne(pi => pi.Product)
                      .WithMany()
                      .HasForeignKey(pi => pi.ProductId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure Payment relationships
            //            modelBuilder.Entity<Payment>()
            //                .HasOne(p => p.Order)
            //                .WithMany()
            //                .HasForeignKey(p => p.OrderId)
            //                .OnDelete(DeleteBehavior.Restrict);

            //            modelBuilder.Entity<Order>().HasData(
            //    new Order
            //    {
            //        OrderId = 1,
            //        CustomerName = "Test User",
            //        CustomerEmail = "test@example.com",
            //        Address = "Noida",
            //        PhoneNumber = "9877366333",
            //        TotalAmount = 200.00m,
            //        OrderDate = new DateTime(2024, 06, 01)  // ✅ fixed date
            //    }
            //);


            //            modelBuilder.Entity<OrderItem>().HasData(
            //                new OrderItem
            //                {
            //                    OrderItemId = 1,
            //                    OrderId = 1,
            //                    ProductName = "Sample Product",
            //                    Quantity = 2,
            //                    ProductPrice = 100.00m /* other fields */
            //                }
            //            );

            // Seed States
            modelBuilder.Entity<StateMaster>().HasData(
                new StateMaster { StateId = 1, StateName = "Bihar" },
                new StateMaster { StateId = 2, StateName = "Uttar Pradesh" },
                new StateMaster { StateId = 3, StateName = "Madhya Pradesh" },
                new StateMaster { StateId = 4, StateName = "Maharashtra" }
            );

            // Seed Districts
            int districtId = 1;
            for (int stateId = 1; stateId <= 4; stateId++)
            {
                for (int i = 1; i < 5; i++)
                {
                    modelBuilder.Entity<DistrictMaster>().HasData(
                        new DistrictMaster
                        {
                            DistrictId = districtId++,
                            DistrictName = $"District -{i}-S{stateId}",
                            StateId = stateId
                        }
                    );
                }
            }

            // Seed Cities
            int cityId = 1;
            for (int distId = 1; distId <= 16; distId++)
            {
                for (int i = 1; i < 5; i++)
                {
                    modelBuilder.Entity<CityMaster>().HasData(
                        new CityMaster
                        {
                            CityId = cityId++,
                            CityName = $"City -{i}-D{distId}",
                            DistrictId = distId
                        }
                    );
                }
            }
        }

    }
}
