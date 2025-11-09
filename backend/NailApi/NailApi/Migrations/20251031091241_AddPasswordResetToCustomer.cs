using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NailApi.Migrations
{
    /// <inheritdoc />
    public partial class AddPasswordResetToCustomer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.AlterColumn<int>(
            //    name: "Status",
            //    table: "nl_Orders",
            //    type: "int",
            //    nullable: false,
            //    defaultValue: 0,
            //    oldClrType: typeof(int),
            //    oldType: "int");

            migrationBuilder.AddColumn<DateTime>(
                name: "ResetPasswordExpiry",
                table: "nl_Customers",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ResetPasswordToken",
                table: "nl_Customers",
                type: "nvarchar(max)",
                nullable: true);

            //migrationBuilder.CreateTable(
            //    name: "nl_Payments",
            //    columns: table => new
            //    {
            //        PaymentId = table.Column<int>(type: "int", nullable: false)
            //            .Annotation("SqlServer:Identity", "1, 1"),
            //        OrderId = table.Column<int>(type: "int", nullable: false),
            //        TransactionId = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
            //        PaymentDate = table.Column<DateTime>(type: "datetime2", nullable: false),
            //        PaidAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
            //        PaymentMethod = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
            //        Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
            //        ScreenshotUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
            //        CustomerNotes = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
            //        AdminNotes = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
            //        VerifiedBy = table.Column<int>(type: "int", nullable: true),
            //        VerifiedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
            //        CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_nl_Payments", x => x.PaymentId);
            //        table.ForeignKey(
            //            name: "FK_nl_Payments_nl_Orders_OrderId",
            //            column: x => x.OrderId,
            //            principalTable: "nl_Orders",
            //            principalColumn: "OrderId",
            //            onDelete: ReferentialAction.Restrict);
            //    });

        //    migrationBuilder.CreateIndex(
        //        name: "IX_nl_Payments_OrderId",
        //        table: "nl_Payments",
        //        column: "OrderId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.DropTable(
            //    name: "nl_Payments");

            migrationBuilder.DropColumn(
                name: "ResetPasswordExpiry",
                table: "nl_Customers");

            migrationBuilder.DropColumn(
                name: "ResetPasswordToken",
                table: "nl_Customers");

        //    migrationBuilder.AlterColumn<int>(
        //        name: "Status",
        //        table: "nl_Orders",
        //        type: "int",
        //        nullable: false,
        //        oldClrType: typeof(int),
        //        oldType: "int",
        //        oldDefaultValue: 0);
        }
    }
}
