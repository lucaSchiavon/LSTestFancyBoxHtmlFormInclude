using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class TestFancy : System.Web.UI.Page
{
    public bool _showFancyBox = false;
    protected void Page_Load(object sender, EventArgs e)
    {

        if (Request.Cookies["infoload"] == null)
        {
            Response.Cookies["infoload"].Value = DateTime.Now.ToString("yy") + DateTime.Now.ToString("MM") + DateTime.Now.ToString("dd");
            //Response.Cookies["infoload"].Expires = DateTime.Now.AddMonths(1);
            _showFancyBox = true;
        }
        //else
        //{
        //    if (Convert.ToInt32(Request.Cookies["infoload"].Value) < Convert.ToInt32(DateTime.Now.ToString("yy") + DateTime.Now.ToString("MM") + DateTime.Now.ToString("dd")))
        //    {
        //        _showFancyBox = true;
        //    }
        //}

        // istruzione per impedire la visualizzazione della lightbox introduttiva
        //_showFancyBox = false;

        if (_showFancyBox)
        {
            Response.Cookies["infoload"].Value = DateTime.Now.ToString("yy") + DateTime.Now.ToString("MM") + DateTime.Now.ToString("dd");

            if (!Page.ClientScript.IsClientScriptBlockRegistered("showFancyBox"))
            {
                Page.ClientScript.RegisterStartupScript(this.GetType(), "showFancyBox", "<script type=\"text/javascript\" src=\"/js/lightbox.js\"></script>");
            }

        }
    }
}