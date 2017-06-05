<%@ Page Language="C#" AutoEventWireup="true" CodeFile="TestFancy.aspx.cs" Inherits="TestFancy" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml" lang="IT">
<head runat="server">
    <title></title>
      <script type="text/javascript" src="/js/jquery-1.4.4.min.js"></script>
    <script type="text/javascript" src="/plugin/fancybox/jquery.fancybox-1.3.4.pack.js"></script>
    <link rel="stylesheet" type="text/css" href="/plugin/fancybox/fancybox.css" />
    <script type="text/javascript" src="/js/jquery.cookie.js"></script>

     <script type="text/javascript">
        $(document).ready(function() {
	     
            $("a.open-box").fancybox({
	            'hideOnContentClick': true
            });
            $("a.hidebox").fancybox();
            
            $(".iframe").fancybox();
            
        });
    </script>
</head>
<body>
    <form id="form1" runat="server">
    <div>
    
    </div>
    </form>
  <%--  <input type="hidden" value="IT" id="lang" />--%>
     <a id="lightbox" style="display:none" href="/lightbox.htm">&nbsp;</a>
</body>
</html>
