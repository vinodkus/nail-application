using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NailApi.Migrations
{
    /// <inheritdoc />
    public partial class AddPasswordResetToCustomer1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.DropForeignKey(
            //    name: "FK_nl_Payments_nl_Orders_OrderId",
            //    table: "nl_Payments");

            //migrationBuilder.DeleteData(
            //    table: "nl_OrderItems",
            //    keyColumn: "OrderItemId",
            //    keyValue: 1);

            //migrationBuilder.DeleteData(
            //    table: "nl_Orders",
            //    keyColumn: "OrderId",
            //    keyValue: 1);

            //migrationBuilder.AddForeignKey(
            //    name: "FK_nl_Payments_nl_Orders_OrderId",
            //    table: "nl_Payments",
            //    column: "OrderId",
            //    principalTable: "nl_Orders",
            //    principalColumn: "OrderId",
            //    onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.DropForeignKey(
            //    name: "FK_nl_Payments_nl_Orders_OrderId",
            //    table: "nl_Payments");

            //migrationBuilder.InsertData(
            //    table: "nl_Orders",
            //    columns: new[] { "OrderId", "Address", "CustomerEmail", "CustomerId", "CustomerName", "OrderDate", "PhoneNumber", "TotalAmount" },
            //    values: new object[] { 1, "Noida", "test@example.com", 0, "Test User", new DateTime(2024, 6, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "9877366333", 200.00m });

            //migrationBuilder.InsertData(
            //    table: "nl_OrderItems",
            //    columns: new[] { "OrderItemId", "OrderId", "ProductId", "ProductName", "ProductPrice", "Quantity" },
            //    values: new object[] { 1, 1, 0, "Sample Product", 100.00m, 2 });

            //migrationBuilder.AddForeignKey(
            //    name: "FK_nl_Payments_nl_Orders_OrderId",
            //    table: "nl_Payments",
            //    column: "OrderId",
            //    principalTable: "nl_Orders",
            //    principalColumn: "OrderId",
            //    onDelete: ReferentialAction.Restrict);
        }
    }
}
