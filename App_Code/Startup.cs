using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(TestFancyBox.Startup))]
namespace TestFancyBox
{
    public partial class Startup {
        public void Configuration(IAppBuilder app) {
            ConfigureAuth(app);
        }
    }
}
