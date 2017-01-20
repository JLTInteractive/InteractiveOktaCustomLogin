#region

using System.Web;
using System.Web.Routing;

#endregion

namespace InteractiveOktaCustomLogin.Web
{
    public class MvcApplication : HttpApplication
    {
        protected void Application_Start()
        {
            RouteConfig.RegisterRoutes(RouteTable.Routes);
        }
    }
}