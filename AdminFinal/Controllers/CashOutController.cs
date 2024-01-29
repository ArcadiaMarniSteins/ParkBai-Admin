using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PayPal.Api;

namespace AdminFinal.Controllers
{
    public class CashOutController : Controller
    {
        // GET: CashOut
        [HttpPost]
        public JsonResult InitiatePayout(string amount)
        {
            try
            {
                string clientId = "AQ2xwNpblJzWWO28ktxI7cXBrGXl_I2POZye7ttQqitxyhsrJKD4ZPg6HbRhRg3D8nL-jYdrFz06sbUC";
                string clientSecret = "EBpMOnhPB8ge8x9wKfZOd0joAdCLKkltnnSi1icIMnihAA832uTwaxhJe3XERFm9nVNE5LvLGwsFhhTk";
                string personalEmail = "lotowner@personal.example.com";

                // Set up PayPal API context
                var config = new Dictionary<string, string>
            {
                { "mode", "sandbox" },
                { "clientId", clientId },
                { "clientSecret", clientSecret }
            };
                var accessToken = new OAuthTokenCredential(config).GetAccessToken();
                var apiContext = new APIContext(accessToken)
                {
                    Config = config
                };

                // Simulate PayPal to email payout
                var payout = new Payout
                {
                    sender_batch_header = new PayoutSenderBatchHeader
                    {
                        sender_batch_id = "batch_" + Guid.NewGuid().ToString().Substring(0, 8),
                        email_subject = "You have a payout!",
                    },
                    items = new List<PayoutItem>
                {
                    new PayoutItem
                    {
                        recipient_type = PayoutRecipientType.EMAIL,
                        amount = new Currency
                        {
                            value = amount,
                            currency = "PHP"
                        },
                        note = "Thank you for trusting ParkBai!",
                        receiver = personalEmail,
                        sender_item_id = "item_" + Guid.NewGuid().ToString().Substring(0, 8)
                    }
                }
                };

                // Create payout
                var createdPayoutBatch = payout.Create(apiContext, false);
                string transactionId = createdPayoutBatch.batch_header.payout_batch_id;

                // You can return a success message or other relevant data
                return Json(new { success = true, message = "Payout initiated successfully", transactionId });
            }
            catch (Exception ex)
            {
                // Log the error or handle it as needed
                return Json(new { success = false, message = "Error initiating payout: " + ex.Message });
            }
        }
    }
}