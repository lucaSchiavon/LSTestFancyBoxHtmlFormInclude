var cookieObj = {
    set: function (cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
    },
    get: function (cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1);
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return "";
    }
};

var matchHex = function (hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    return /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
}

var hexToRgb = function (hex) {
    var result = matchHex(hex);
    return result ? "rgb(" + parseInt(result[1], 16) + ", " + parseInt(result[2], 16) + ", " + parseInt(result[3], 16) + ")" : "";
}

var hexToRgba = function (hex, opacity) {
    var result = matchHex(hex);
    return result ? "rgba(" + parseInt(result[1], 16) + ", " + parseInt(result[2], 16) + ", " + parseInt(result[3], 16) + ", " + opacity + ")" : "";
}

var showCookieBar = function (options) {
    var options = options || {},
        containerTag = options.containerTag || "div",
        containerId = options.containerId || "cookie-msg",
        containerClasses = options.containerClasses || "",
        textWrapperTag = options.textWrapperTag || "p",
        textWrapperId = options.textWrapperId || "",
        textWrapperClasses = options.textWrapperClasses || "",
        textAlign = options.textAlign || "center",
        fontSize = options.fontSize || "14px",
        position = options.position || "fixed",
        top = options.top || false,
        bottom = options.bottom || true,
        zIndex = options.zIndex || "9999",
        width = options.width || "100%",
        padding = options.padding || "5px",
        color = options.color || "#000",
        backgroundColor = options.backgroundColor || "#e1e1e1",
        backgroundOpacity = options.backgroundOpacity || "0.9",
        textContent = options.textContent || {
            it: "Questo sito web utilizza i cookie per assicurarti la migliore esperienza di navigazione possibile. Navigandolo ne accetti l'utilizzo: per avere maggiori informazioni puoi consultare la <a style='color:#000;' class='hidebox' href='#privacy'>Privacy</a> - <a style='color:#000;  color: #000;padding: 3px;border: 2px solid #666;  text-transform: uppercase;' class='hypScopri' href='javascript:void(0);' id='cookie-accept'>accetta</a>",
            en: "This website uses cookies in order to improve functionality. By continuing to use this site, the user consents to and accepts the use of cookies. For more information, <a style='color:#000;' class='hidebox' href='#privacy'>Privacy</a> - <a  style='color:#000;padding: 3px;border: 2px solid #666;  text-transform: uppercase;' class='hypScopri' href='javascript:void(0);' id='cookie-accept'>accept</a>",
            de: "Diese Website verwendet Cookies, um die Bereitstellung von Diensten zu verbessern. Durch die Nutzung dieser Website erkl�ren Sie sich mit der Verwendung von Cookies einverstanden.<br><br> Weitere Informationen �ber die Verwendung von Cookies  [LINK] - <a  style='color:#000;padding: 3px;border: 2px solid #666;  text-transform: uppercase;' class='hypScopri' href='javascript:void(0);' id='cookie-accept'>Schlie�en</a>",
            fr: "Ce site Web utilise des cookies afin d'am�liorer son utilisation. En continuant votre navigation sur ce site, l'utilisateur autorise et accepte l'utilisation des cookies. Pour de plus amples informations,  [LINK] - <a  style='color:#000;padding: 3px;border: 2px solid #666;  text-transform: uppercase;' class='hypScopri' href='javascript:void(0);' id='cookie-accept'>Fermer</a>",
            es: "Esta p�gina web utiliza cookies para mejorar la experiencia de navegaci�n de sus usuarios. Si contin�a navegando, usted acepta el uso de las cookies. Para m�s informaci�n,   [LINK] - <a  style='color:#000;padding: 3px;border: 2px solid #666;  text-transform: uppercase;' class='hypScopri' href='javascript:void(0);' id='cookie-accept'>Cerrar</a>"
        },
        linkContent = options.linkContent || { it: "", en: "", de: "entnehmen Sie bitte der Cookie-Richtlinie.", fr: "consultez notre Politique en mati�re de cookies.", es: "consulte nuestra Pol�tica de Cookies" },
        linkHref = options.linkHref || { it: "/privacy-policy", en: "/en/cookies", de: "/de/cookies", fr: "/fr/cookies", es: "/es/cookies" },
        langTag = options.langTag || "html",
        langId = options.langId || "",
        langAttribute = options.langAttribute || "lang";

    // bar element creation
    var elem = document.createElement(containerTag);
    if (containerId.length > 0) { elem.id = containerId; }
    if (containerClasses.length > 0) { elem.className = containerClasses; }

    // bar styles 
    elem.style.textAlign = textAlign;
    elem.style.fontSize = fontSize;
    elem.style.position = position;
    elem.style.zIndex = zIndex;
    elem.style.width = width;
    elem.style.padding = padding;
    if (top) { elem.style.top = "0px"; }
    if (bottom) { elem.style.bottom = "0px"; }
    elem.style.color = hexToRgb(color);
    elem.style.background = hexToRgba(backgroundColor, backgroundOpacity);

    // open tag that wrap text
    var innerHTML = "<" + textWrapperTag + " style='margin:10px 0px;' ";
    if (textWrapperId.length > 0) {
        innerHTML += "style='margin:10px 0px; id='" + textWrapperId + "'";
    }
    if (textWrapperClasses.length > 0) {
        innerHTML += " class='" + textWrapperClasses + "' style='margin:10px 0px;' ";
    }
    innerHTML += ">";

    // read language from DOM (if an ID is specif
    var langElem = null;
    if (langTag.length > 0) {
        langElem = document.getElementsByTagName(langTag)[0];
    }
    if (langId.length > 0) {
        langElem = document.getElementById(langId);
    }

    var inputLang = langElem != null ? langElem.getAttribute(langAttribute) : "";
    inputLang = typeof (inputLang) !== 'undefined' && inputLang.length > 0 ? inputLang.toLowerCase() : "";

    var link = "<a class='privacy-trigger' style='color:#000;text-decoration:underline' href='" + linkHref[inputLang] + "'>" + linkContent[inputLang] + "</a>";
    var content = textContent[inputLang].replace("[LINK]", link);

    innerHTML += content;
    innerHTML += "</" + textWrapperTag + ">";

    elem.innerHTML = innerHTML;

    var showMsg = cookieObj.get("cookie_policy_accepted") == "";
    if (showMsg) {
        document.body.appendChild(elem);

        document.getElementById('cookie-accept').addEventListener('click', function () {
            document.getElementById(containerId).style.display = 'none';
            cookieObj.set('cookie_policy_accepted', 'accepted', 365);
        });
    }
};


$(document).ready(function () {

    //COOKIES
    showCookieBar({ langId: "lang", langAttribute: "value" });

});