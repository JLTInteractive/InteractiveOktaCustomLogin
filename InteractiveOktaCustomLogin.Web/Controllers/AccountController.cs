#region

using System.Web.Mvc;

#endregion

namespace InteractiveOktaCustomLogin.Web.Controllers
{
    public class AccountController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}