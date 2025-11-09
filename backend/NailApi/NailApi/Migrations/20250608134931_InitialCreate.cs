using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace NailApi.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "nl_Categories",
                columns: table => new
                {
                    CategoryId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoryName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_nl_Categories", x => x.CategoryId);
                });

            migrationBuilder.CreateTable(
                name: "nl_Customers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_nl_Customers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "nl_Employees",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StateId = table.Column<int>(type: "int", nullable: false),
                    DistrictId = table.Column<int>(type: "int", nullable: false),
                    CityId = table.Column<int>(type: "int", nullable: false),
                    ImagePath = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_nl_Employees", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "nl_Orders",
                columns: table => new
                {
                    OrderId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CustomerName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CustomerEmail = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TotalAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    OrderDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_nl_Orders", x => x.OrderId);
                });

            migrationBuilder.CreateTable(
                name: "nl_States",
                columns: table => new
                {
                    StateId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StateName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_nl_States", x => x.StateId);
                });

            migrationBuilder.CreateTable(
                name: "nl_Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Username = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_nl_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "nl_Products",
                columns: table => new
                {
                    ProductId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductSku = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProductName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProductPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ProductShortName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProductDescription = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DeliveryTimeSpan = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CategoryId = table.Column<int>(type: "int", nullable: false),
                    ProductImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_nl_Products", x => x.ProductId);
                    table.ForeignKey(
                        name: "FK_nl_Products_nl_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "nl_Categories",
                        principalColumn: "CategoryId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "nl_OrderItems",
                columns: table => new
                {
                    OrderItemId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    ProductName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProductPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    OrderId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_nl_OrderItems", x => x.OrderItemId);
                    table.ForeignKey(
                        name: "FK_nl_OrderItems_nl_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "nl_Orders",
                        principalColumn: "OrderId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "nl_Districts",
                columns: table => new
                {
                    DistrictId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DistrictName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    StateId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_nl_Districts", x => x.DistrictId);
                    table.ForeignKey(
                        name: "FK_nl_Districts_nl_States_StateId",
                        column: x => x.StateId,
                        principalTable: "nl_States",
                        principalColumn: "StateId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "nl_Cities",
                columns: table => new
                {
                    CityId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CityName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    DistrictId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_nl_Cities", x => x.CityId);
                    table.ForeignKey(
                        name: "FK_nl_Cities_nl_Districts_DistrictId",
                        column: x => x.DistrictId,
                        principalTable: "nl_Districts",
                        principalColumn: "DistrictId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "nl_Orders",
                columns: new[] { "OrderId", "Address", "CustomerEmail", "CustomerName", "OrderDate", "PhoneNumber", "TotalAmount" },
                values: new object[] { 1, "Noida", "test@example.com", "Test User", new DateTime(2024, 6, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "9877366333", 200.00m });

            migrationBuilder.InsertData(
                table: "nl_States",
                columns: new[] { "StateId", "StateName" },
                values: new object[,]
                {
                    { 1, "Bihar" },
                    { 2, "Uttar Pradesh" },
                    { 3, "Madhya Pradesh" },
                    { 4, "Maharashtra" }
                });

            migrationBuilder.InsertData(
                table: "nl_Districts",
                columns: new[] { "DistrictId", "DistrictName", "StateId" },
                values: new object[,]
                {
                    { 1, "District -1-S1", 1 },
                    { 2, "District -2-S1", 1 },
                    { 3, "District -3-S1", 1 },
                    { 4, "District -4-S1", 1 },
                    { 5, "District -1-S2", 2 },
                    { 6, "District -2-S2", 2 },
                    { 7, "District -3-S2", 2 },
                    { 8, "District -4-S2", 2 },
                    { 9, "District -1-S3", 3 },
                    { 10, "District -2-S3", 3 },
                    { 11, "District -3-S3", 3 },
                    { 12, "District -4-S3", 3 },
                    { 13, "District -1-S4", 4 },
                    { 14, "District -2-S4", 4 },
                    { 15, "District -3-S4", 4 },
                    { 16, "District -4-S4", 4 }
                });

            migrationBuilder.InsertData(
                table: "nl_OrderItems",
                columns: new[] { "OrderItemId", "OrderId", "ProductId", "ProductName", "ProductPrice", "Quantity" },
                values: new object[] { 1, 1, 0, "Sample Product", 100.00m, 2 });

            migrationBuilder.InsertData(
                table: "nl_Cities",
                columns: new[] { "CityId", "CityName", "DistrictId" },
                values: new object[,]
                {
                    { 1, "City -1-D1", 1 },
                    { 2, "City -2-D1", 1 },
                    { 3, "City -3-D1", 1 },
                    { 4, "City -4-D1", 1 },
                    { 5, "City -1-D2", 2 },
                    { 6, "City -2-D2", 2 },
                    { 7, "City -3-D2", 2 },
                    { 8, "City -4-D2", 2 },
                    { 9, "City -1-D3", 3 },
                    { 10, "City -2-D3", 3 },
                    { 11, "City -3-D3", 3 },
                    { 12, "City -4-D3", 3 },
                    { 13, "City -1-D4", 4 },
                    { 14, "City -2-D4", 4 },
                    { 15, "City -3-D4", 4 },
                    { 16, "City -4-D4", 4 },
                    { 17, "City -1-D5", 5 },
                    { 18, "City -2-D5", 5 },
                    { 19, "City -3-D5", 5 },
                    { 20, "City -4-D5", 5 },
                    { 21, "City -1-D6", 6 },
                    { 22, "City -2-D6", 6 },
                    { 23, "City -3-D6", 6 },
                    { 24, "City -4-D6", 6 },
                    { 25, "City -1-D7", 7 },
                    { 26, "City -2-D7", 7 },
                    { 27, "City -3-D7", 7 },
                    { 28, "City -4-D7", 7 },
                    { 29, "City -1-D8", 8 },
                    { 30, "City -2-D8", 8 },
                    { 31, "City -3-D8", 8 },
                    { 32, "City -4-D8", 8 },
                    { 33, "City -1-D9", 9 },
                    { 34, "City -2-D9", 9 },
                    { 35, "City -3-D9", 9 },
                    { 36, "City -4-D9", 9 },
                    { 37, "City -1-D10", 10 },
                    { 38, "City -2-D10", 10 },
                    { 39, "City -3-D10", 10 },
                    { 40, "City -4-D10", 10 },
                    { 41, "City -1-D11", 11 },
                    { 42, "City -2-D11", 11 },
                    { 43, "City -3-D11", 11 },
                    { 44, "City -4-D11", 11 },
                    { 45, "City -1-D12", 12 },
                    { 46, "City -2-D12", 12 },
                    { 47, "City -3-D12", 12 },
                    { 48, "City -4-D12", 12 },
                    { 49, "City -1-D13", 13 },
                    { 50, "City -2-D13", 13 },
                    { 51, "City -3-D13", 13 },
                    { 52, "City -4-D13", 13 },
                    { 53, "City -1-D14", 14 },
                    { 54, "City -2-D14", 14 },
                    { 55, "City -3-D14", 14 },
                    { 56, "City -4-D14", 14 },
                    { 57, "City -1-D15", 15 },
                    { 58, "City -2-D15", 15 },
                    { 59, "City -3-D15", 15 },
                    { 60, "City -4-D15", 15 },
                    { 61, "City -1-D16", 16 },
                    { 62, "City -2-D16", 16 },
                    { 63, "City -3-D16", 16 },
                    { 64, "City -4-D16", 16 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_nl_Cities_DistrictId",
                table: "nl_Cities",
                column: "DistrictId");

            migrationBuilder.CreateIndex(
                name: "IX_nl_Districts_StateId",
                table: "nl_Districts",
                column: "StateId");

            migrationBuilder.CreateIndex(
                name: "IX_nl_OrderItems_OrderId",
                table: "nl_OrderItems",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_nl_Products_CategoryId",
                table: "nl_Products",
                column: "CategoryId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "nl_Cities");

            migrationBuilder.DropTable(
                name: "nl_Customers");

            migrationBuilder.DropTable(
                name: "nl_Employees");

            migrationBuilder.DropTable(
                name: "nl_OrderItems");

            migrationBuilder.DropTable(
                name: "nl_Products");

            migrationBuilder.DropTable(
                name: "nl_Users");

            migrationBuilder.DropTable(
                name: "nl_Districts");

            migrationBuilder.DropTable(
                name: "nl_Orders");

            migrationBuilder.DropTable(
                name: "nl_Categories");

            migrationBuilder.DropTable(
                name: "nl_States");
        }
    }
}
