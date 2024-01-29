using FirebaseAdmin.Messaging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using Microsoft.Ajax.Utilities;

namespace AdminFinal.Controllers
{
    public class HomeController : Controller
    {
        [HttpPost]
        public async Task<JsonResult> TriggerIFTTT(string eventValue, string key, string email, string message)
        {
            try
            {
                using (HttpClient client = new HttpClient())
                {

                    var payload = new
                    {
                        value1 = email,
                        value2 = message
                    };

                    var content = new StringContent(JsonConvert.SerializeObject(payload), System.Text.Encoding.UTF8, "application/json");
                    var response = await client.PostAsync($"https://maker.ifttt.com/trigger/{eventValue}/with/key/{key}", content);

                    if (response.IsSuccessStatusCode)
                    {
                        var responseData = await response.Content.ReadAsStringAsync();

                        //Return the raw response data as a string
                        return Json(new { success = true, responseData });
                    }
                    else
                    {
                        return Json(new { error = "IFTTT Request Failed", statusCode = response.StatusCode });
                    }
                }
            }

            catch (Exception ex)
            {
                //Log the exception details for debugging purposes
                Console.WriteLine(ex);

                //Return a meaningful error message
                return Json(new { error = "Internal Server Error", errorMesssa = ex.Message });
            }
        }


        public ActionResult Login()
        {
            return View();
        }

        public ActionResult Logout()
        {
            Session.Clear();
            return Json(new { success = true }, JsonRequestBehavior.AllowGet);

        }

        public ActionResult LoginSession()
        {
            var data = new List<object>(2);
            var uid = Request["uid"];
            Console.WriteLine(uid);
            Session["IsAuthenticated"] = true;
            Session["AdminId"]= uid;
            data.Add(new
            {
                mess = 1
            });
            return Json(data, JsonRequestBehavior.AllowGet);
        }

        public ActionResult AdminMain() 
        {
            bool isAutheticated = Session["IsAuthenticated"] as bool? ?? false;
            var uid = Session["AdminId"];
                if(Request.HttpMethod != "POST")
            {
                if (!isAutheticated)
                {
                    Console.WriteLine("ERROR!");
                    return RedirectToAction("Login", "Home", new { area = "" });
                }
            }

            Response.Cache.SetCacheability(HttpCacheability.NoCache);
            Response.Cache.SetNoStore();
            Response.AppendHeader("Pragma", "no-cache");
            Response.AppendHeader("Expires", "0");


            return View();
        }

        public ActionResult DriverBal()
        {
            bool isAutheticated = Session["IsAuthenticated"] as bool? ?? false;
            var uid = Session["AdminId"];
            if (Request.HttpMethod != "POST")
            {
                if (!isAutheticated)
                {
                    Console.WriteLine("ERROR!");
                    return RedirectToAction("Login", "Home", new { area = "" });
                }
            }

            Response.Cache.SetCacheability(HttpCacheability.NoCache);
            Response.Cache.SetNoStore();
            Response.AppendHeader("Pragma", "no-cache");
            Response.AppendHeader("Expires", "0");


            return View();
        }

        public ActionResult OwnerBal()
        {
            bool isAutheticated = Session["IsAuthenticated"] as bool? ?? false;
            var uid = Session["AdminId"];
            if (Request.HttpMethod != "POST")
            {
                if (!isAutheticated)
                {
                    Console.WriteLine("ERROR!");
                    return RedirectToAction("Login", "Home", new { area = "" });
                }
            }

            Response.Cache.SetCacheability(HttpCacheability.NoCache);
            Response.Cache.SetNoStore();
            Response.AppendHeader("Pragma", "no-cache");
            Response.AppendHeader("Expires", "0");


            return View();
        }


        public ActionResult VehicleApp()
        {
            bool isAutheticated = Session["IsAuthenticated"] as bool? ?? false;
            var uid = Session["AdminId"];
            if (Request.HttpMethod != "POST")
            {
                if (!isAutheticated)
                {
                    Console.WriteLine("ERROR!");
                    return RedirectToAction("Login", "Home", new { area = "" });
                }
            }
            Response.Cache.SetCacheability(HttpCacheability.NoCache);
            Response.Cache.SetNoStore();
            Response.AppendHeader("Pragma", "no-cache");
            Response.AppendHeader("Expires", "0");

            return View("~/Views/Home/Driver/VehicleApp.cshtml");
        }
        public ActionResult VehicleAppDet()
        {
            bool isAutheticated = Session["IsAuthenticated"] as bool? ?? false;
            var uid = Session["AdminId"];
            if (Request.HttpMethod != "POST")
            {
                if (!isAutheticated)
                {
                    Console.WriteLine("ERROR!");
                    return RedirectToAction("Login", "Home", new { area = "" });
                }
            }

            Response.Cache.SetCacheability(HttpCacheability.NoCache);
            Response.Cache.SetNoStore();
            Response.AppendHeader("Pragma", "no-cache");
            Response.AppendHeader("Expires", "0");
            return View("~/Views/Home/Driver/VehicleAppDet.cshtml");
        }
        public ActionResult DriverList()
        {
            bool isAutheticated = Session["IsAuthenticated"] as bool? ?? false;
            var uid = Session["AdminId"];
            if (Request.HttpMethod != "POST")
            {
                if (!isAutheticated)
                {
                    Console.WriteLine("ERROR!");
                    return RedirectToAction("Login", "Home", new { area = "" });
                }
            }
            Response.Cache.SetCacheability(HttpCacheability.NoCache);
            Response.Cache.SetNoStore();
            Response.AppendHeader("Pragma", "no-cache");
            Response.AppendHeader("Expires", "0");
            return View("~/Views/Home/Driver/DriverList.cshtml");
        }
        public ActionResult DriverDetails()
        {
            bool isAutheticated = Session["IsAuthenticated"] as bool? ?? false;
            var uid = Session["AdminId"];
            if (Request.HttpMethod != "POST")
            {
                if (!isAutheticated)
                {
                    Console.WriteLine("ERROR!");
                    return RedirectToAction("Login", "Home", new { area = "" });
                }
            }
            Response.Cache.SetCacheability(HttpCacheability.NoCache);
            Response.Cache.SetNoStore();
            Response.AppendHeader("Pragma", "no-cache");
            Response.AppendHeader("Expires", "0");
            return View("~/Views/Home/Driver/DriverDetails.cshtml");
        }
        public ActionResult VehicleDetails()
        {
            bool isAutheticated = Session["IsAuthenticated"] as bool? ?? false;
            var uid = Session["AdminId"];
            if (Request.HttpMethod != "POST")
            {
                if (!isAutheticated)
                {
                    Console.WriteLine("ERROR!");
                    return RedirectToAction("Login", "Home", new { area = "" });
                }
            }
            Response.Cache.SetCacheability(HttpCacheability.NoCache);
            Response.Cache.SetNoStore();
            Response.AppendHeader("Pragma", "no-cache");
            Response.AppendHeader("Expires", "0");
            return View("~/Views/Home/Driver/VehicleDetails.cshtml");
        }

        public ActionResult VehicleList()
        {
            bool isAutheticated = Session["IsAuthenticated"] as bool? ?? false;
            var uid = Session["AdminId"];
            if (Request.HttpMethod != "POST")
            {
                if (!isAutheticated)
                {
                    Console.WriteLine("ERROR!");
                    return RedirectToAction("Login", "Home", new { area = "" });
                }
            }
            Response.Cache.SetCacheability(HttpCacheability.NoCache);
            Response.Cache.SetNoStore();
            Response.AppendHeader("Pragma", "no-cache");
            Response.AppendHeader("Expires", "0");
            return View("~/Views/Home/Driver/VehicleList.cshtml");
        }

        public ActionResult OwnerApp()
        {
            bool isAutheticated = Session["IsAuthenticated"] as bool? ?? false;
            var uid = Session["AdminId"];
            if (Request.HttpMethod != "POST")
            {
                if (!isAutheticated)
                {
                    Console.WriteLine("ERROR!");
                    return RedirectToAction("Login", "Home", new { area = "" });
                }
            }
            Response.Cache.SetCacheability(HttpCacheability.NoCache);
            Response.Cache.SetNoStore();
            Response.AppendHeader("Pragma", "no-cache");
            Response.AppendHeader("Expires", "0");
            return View("~/Views/Home/Owner/OwnerApp.cshtml");
        }

        public ActionResult OwnerAppDet()
        {
            bool isAutheticated = Session["IsAuthenticated"] as bool? ?? false;
            var uid = Session["AdminId"];
            if (Request.HttpMethod != "POST")
            {
                if (!isAutheticated)
                {
                    Console.WriteLine("ERROR!");
                    return RedirectToAction("Login", "Home", new { area = "" });
                }
            }
            Response.Cache.SetCacheability(HttpCacheability.NoCache);
            Response.Cache.SetNoStore();
            Response.AppendHeader("Pragma", "no-cache");
            Response.AppendHeader("Expires", "0");
            return View("~/Views/Home/Owner/OwnerAppDet.cshtml");
        }

        public ActionResult ListOwner()
        {
            bool isAutheticated = Session["IsAuthenticated"] as bool? ?? false;
            var uid = Session["AdminId"];
            if (Request.HttpMethod != "POST")
            {
                if (!isAutheticated)
                {
                    Console.WriteLine("ERROR!");
                    return RedirectToAction("Login", "Home", new { area = "" });
                }
            }
            Response.Cache.SetCacheability(HttpCacheability.NoCache);
            Response.Cache.SetNoStore();
            Response.AppendHeader("Pragma", "no-cache");
            Response.AppendHeader("Expires", "0");
            return View("~/Views/Home/Owner/ListOwner.cshtml");
        }

        public ActionResult OwnerDetails()
        {
            bool isAutheticated = Session["IsAuthenticated"] as bool? ?? false;
            var uid = Session["AdminId"];
            if (Request.HttpMethod != "POST")
            {
                if (!isAutheticated)
                {
                    Console.WriteLine("ERROR!");
                    return RedirectToAction("Login", "Home", new { area = "" });
                }
            }
            Response.Cache.SetCacheability(HttpCacheability.NoCache);
            Response.Cache.SetNoStore();
            Response.AppendHeader("Pragma", "no-cache");
            Response.AppendHeader("Expires", "0");
            return View("~/Views/Home/Owner/OwnerDetails.cshtml");
        }

        public ActionResult OwnerCashOut()
        {
            bool isAutheticated = Session["IsAuthenticated"] as bool? ?? false;
            var uid = Session["AdminId"];
            if (Request.HttpMethod != "POST")
            {
                if (!isAutheticated)
                {
                    Console.WriteLine("ERROR!");
                    return RedirectToAction("Login", "Home", new { area = "" });
                }
            }
            Response.Cache.SetCacheability(HttpCacheability.NoCache);
            Response.Cache.SetNoStore();
            Response.AppendHeader("Pragma", "no-cache");
            Response.AppendHeader("Expires", "0");
            return View("~/Views/Home/Owner/OwnerCashOut.cshtml");
        }


    }
}