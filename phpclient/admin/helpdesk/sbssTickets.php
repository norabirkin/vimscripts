<?php
/**
 * SBSS trouble tickets managment system.
 * Client troubles resolving
 */

// Load SBSS classes
include_once("sbss.class.php");
include_once("sbssFiles.class.php");
include_once("knowledge.class.php");
include_once("sbssTicketsHelpers.php");
// Create sbss classes
$sbss = new SBSS($lanbilling);

// Identifying request types for the future actions
switch( true )
{
    // If there was background request from the user browser
    case( isset($_POST["async_call"]) ):
        if( isset($_POST["get_user_accounts"]) ) {
            getUserAccounts( $lanbilling , (integer)$_POST["uid"] );
        } elseif (isset($_POST["getticketslistdata"])) {
            getTicketsListData($sbss, $localize);
        } elseif (isset($_POST['getpostsdata'])) {
            getPostsData($sbss, $localize);
        } elseif (isset($_POST['savepost'])) {
            savePostAsync($sbss, $localize);
        } elseif (isset($_POST['delpost'])) {
            delPostAsync($sbss, $localize);
        } elseif (isset($_POST['lockticket'])) {
            lockTicketAsync($sbss, $localize);
        }
        exit();
    break;

    // If there was request to edit post from ticket
    case (isset($_POST["editPostId"]) && $_POST["editPostId"] > 0):
        if(isset($_POST["save"]) && saveSelectedPost($sbss))
            showPosts($sbss, $localize);
        else editPost($sbss, $localize);
    break;

    // If there was request to remove post from ticket
    case (isset($_POST["dropPostId"])):
        deletePost($sbss);
        showPosts($sbss, $localize);
    break;

    // Show posts list
    case (!isset($_POST["save"]) && isset($_POST["ticketId"])):
        if($_POST["ticketId"] == 0) createTicket($sbss, $localize);
        else showPosts($sbss, $localize);
    break;

    // Save new ticket or add message to existing
    default:
        if(isset($_POST["save"]) && isset($_POST["ticketId"]))
        {
            if(!saveTicket($sbss))
            {
                if($_POST["ticketId"] == 0) createTicket($sbss, $localize);
                else showPosts($sbss, $localize);
            }
            else
            {
                showTickets($sbss, $localize);
                sendNotifications($lanbilling, $sbss);
            }
        }
        else showTickets($sbss, $localize);
}

/**
 * Show tickets list with filter action
 * @param   object sbss class
 * @param   object, localize class
 */
function showTickets( &$sbss, &$localize )
{
    $tpl = new HTML_Template_IT(TPLS_PATH);

    $tpl->loadTemplatefile("sbssTicketsAsync.tpl",true,true);
    $tpl->touchBlock('__global__');
    $tpl->show();
    return;

    $tpl->loadTemplatefile("sbssTickets.tpl",true,true);

    // Ther was request to find manager as author. Set search key according search type
    if(isset($_POST["manId"]) && is_numeric($_POST["manId"]))
    {
        $_POST["srchKey"] = $_POST["manId"];
        $_POST["manForType"] = 2;
    }

    // Ther was request to find client as author. Set search key according search type
    if(isset($_POST["clientId"]) && $_POST["clientId"] != "")
        $_POST["srchKey"] = -2;

    // Field visualization if manager is selected
    if($_POST["srchKey"] > -1)
    {
        $tpl->touchBlock("stringDisable");
        $tpl->touchBlock("stringNone");
        $tpl->touchBlock("manForSel-" . $_POST["manForType"]);
    }
    // Field visualization if manager is not selected
    else
    {
        $tpl->touchBlock("manForDisable");
        $tpl->touchBlock("manForNone");
        if($_POST["srchKey"] == -2 && !empty($_POST["clientId"]))
            $tpl->setVariable("STRINGVALUE", htmlspecialchars($sbss->settings->clientList[$_POST["clientId"]]["name"], ENT_QUOTES));
        else $tpl->setVariable("STRINGVALUE", htmlspecialchars($_POST["string"], ENT_QUOTES));
    }

    if(empty($sbss->settings->statusList))
    {
        $tpl->setCurrentBlock("StatusNone");
        $tpl->syncBlockLocalize("StatusNone");
        $tpl->parseCurrentBlock();
        $tpl->syncBlockLocalize("__global__");
        $localize->compile($tpl->get(), true);
        return false;
    }

    // Show button to create new ticket
    $tpl->setCurrentBlock("newTicket");
    $tpl->syncBlockLocalize("newTicket");
    $tpl->parseCurrentBlock();

    switch( true )
    {
        // Looking fot the client as author
        case ($_POST["srchKey"] == -2):
            $authorType = 1;

            if(!empty($_POST["string"]))
            {
                // Empty id, only string to search
                if(!isset($_POST["clientId"]) || $_POST["clientId"] == "")
                {
                    $authorId = $sbss->searchUsers($_POST["string"]);
                    $_POST["clientId"] = (sizeof($authorId) > 0) ? implode(",", $authorId) : "";
                }
                else $authorId = explode(",", $_POST["clientId"]);
            }
            else
            {
                if(isset($_POST["clientId"]) && $_POST["clientId"] != "")
                    $authorId = explode(",", $_POST["clientId"]);

                // Reset fields if string is empty and pressed search button
                if(isset($_POST["search"]))
                {
                    $authorType = null;
                    $authorId = null;
                    $responsible = null;
                    unset($_POST["clientId"]);
                    $_POST["srchKey"] == -1;
                }
            }
        break;

        // Looking for manager
        case ($_POST["srchKey"] > -1):
            // Manager is author
            if($_POST["manForType"] == 2)
            {
                $authorType = 0;
                $authorId = $_POST["srchKey"];
                $responsible = null;
            }
            // Manager is responsible
            else
            {
                $authorType = null;
                $authorId = null;
                $responsible = $_POST["srchKey"];
            }
        break;

        // Looking for the context string
        case ($_POST["srchKey"] == -1):
            $string = $_POST["string"];
        // Reset to first value if search control is set to not allowed value
        default:
            $authorType = null;
            $authorId = null;
            $responsible = null;
            $_POST["srchKey"] = -1;
    }

    $tpl->setCurrentBlock("StatusAndGroups");
    $tpl->syncBlockLocalize("StatusAndGroups");

    // Show statuses
    if(!isset($_POST["stat_show"]))
        $tpl->touchBlock("staus_visible");
    else $tpl->touchBlock("statusBlockChecked");

    // Build table with statuses and rebuild it if there was submit
    if(sizeof($sbss->settings->statusList) > 0)
    {
        $counter =0;
        if(!is_array($_POST["status_id2show"])) $status_id2show = array();
        foreach($sbss->settings->statusList as $key => $arr)
        {
            $counter++;
            $tpl->setCurrentBlock("status_cell");
            $tpl->setVariable("THISSTATUSID", $key);
            $tpl->setVariable("THISSTATUSNAME", $arr["descr"]);

            if(is_array($_POST["status_id2show"]))
            {
                if(is_integer(array_search($key, $_POST["status_id2show"])))
                    $tpl->touchBlock("status_checked");
            }
            else
            {
                if($arr["display_def"] == 1)
                {
                    $tpl->touchBlock("status_checked");
                    $status_id2show[] = $key;
                }
            }

            $tpl->parseCurrentBlock();
            if(($counter % 3) == 0) $tpl->parse("status_col");
        }

        if(!is_array($_POST["status_id2show"])) $_POST["status_id2show"] = $status_id2show;
    }

    // Show ticket classes group by
    if(isset($_POST["group_class"])) $tpl->setVariable("GROUPCLASSVALUE", $_POST["group_class"]);
    else $tpl->setVariable("GROUPCLASSVALUE", -1);

    // Check and set page variable
    if(!isset($_POST["page"]) || $_POST["page"] <= 0) $_POST["page"] = 1;

    if(isset($_POST["group_class"]))
    {
        $groups = explode(",", $_POST["group_class"]);
        // Get tickets list with grouping by classes
        $filter = array("string" => $string,
                "authorType" => $authorType,
                "authorId" => $authorId,
                "status" => $_POST["status_id2show"],
                "classId" => explode(",", $_POST["group_class"]),
                "responsible" => $responsible);
        $tickets = $sbss->getTickets($filter, 0, 1, $_POST["page"]);

        $tpl->touchBlock("groupClChecked");
        foreach($sbss->settings->requestClasses as $key => $arr)
        {
            $tpl->setCurrentBlock("tickets_groups_title");
            $tpl->syncBlockLocalize("tickets_groups_title");
            $tpl->setVariable("THISCLASSID", $key);
            $tpl->setVariable("THISGROUPNAME", $arr["descr"]);
            $tpl->setVariable("THISGROUPCOLOR", $arr["color"]);

            if(!isset($sbss->settings->managerList[$arr["responsible"]]["name"]))
                $tpl->setVariable("THISMANNAME", sprintf("<i>(%s)</i>", NOT_SET));
            else $tpl->setVariable("THISMANNAME", $sbss->settings->managerList[$arr["responsible"]]["name"]);
            $tpl->parseCurrentBlock();
            // Print ticket Row
            if($_POST["group_class"] == $key) ticketItems($tpl, $sbss, $tickets);
            $tpl->parse("tickets_groups");
        }
    }
    // If there is no flag to group by ticket's classes
    else
    {
        $filter = array("string" => $string,
                "authorType" => $authorType,
                "authorId" => $authorId,
                "status" => $_POST["status_id2show"],
                "responsible" => $responsible);
        $tickets = $sbss->getTickets($filter, 0, 1, $_POST["page"]);

        // Print ticket Row
        ticketItems($tpl, $sbss, $tickets);
    }

    // Create managers list to search selector on the form
    foreach($sbss->settings->managerList as $key => $arr)
    {
        $tpl->setCurrentBlock("searchByMan");
        $tpl->setVariable("SRCHMANID", $key);
        $tpl->setVariable("SRCHMANNAME", $arr["name"]);
        // If search key is the same as manager id, than mark as selected
        if($_POST["srchKey"] != "" && $_POST["srchKey"] == $key) $tpl->touchBlock("searchSelMan");
        $tpl->parseCurrentBlock();
    }

    $tpl->touchBlock("searchSel" . $_POST["srchKey"]);
    $tpl->syncBlockLocalize("__global__");
    $localize->compile($tpl->get(), true);
} // end showTickets()


/**
 * Parse tickets list returned by query
 * @param   object template
 * @param   object sbss
 * @param   array, tickets list
 */
function ticketItems( &$tpl, &$sbss, &$tickets )
{
    if(empty($tickets))
    {
        $tpl->setCurrentBlock("ticket_item_empty");
        $tpl->syncBlockLocalize("ticket_item_empty");
        $tpl->parseCurrentBlock();
        return;
    }

    $tpl->setCurrentBlock("tickets_list_title");
    $tpl->syncBlockLocalize("tickets_list_title");

    // Page line to create
    if($_POST["page"] > $sbss->pageBlock)
    {
        $tpl->setCurrentBlock("pBack");
        $tpl->setVariable("PAGE", $_POST["page"]);
        $tpl->parse("pBack");
    }

    for($p = ($_POST["page"] - ($_POST["page"] % $sbss->pageBlock)), $off = min(($p + $sbss->pageBlock), $sbss->pages); $p <= $off; $p++)
    {
        if($p == 0) $p++;

        if($_POST["page"] != $p)
        {
            $tpl->setCurrentBlock("pGoto");
            $tpl->setVariable("PAGE", $p);
            $tpl->parseCurrentBlock();
        }
        else
        {
            $tpl->setCurrentBlock("pSel");
            $tpl->setVariable("PAGE", $p);
            $tpl->parseCurrentBlock();
        }

        $tpl->parse("pages");
    }

    $tpl->setVariable("COUNTOPENED", $sbss->totalRows);
    $tpl->parse("tickets_list_title");

    // Parse tickets array
    foreach($tickets as $arr)
    {
        if(!isset($sbss->settings->requestClasses[$arr["class"]]["color"]) ||
            empty($sbss->settings->requestClasses[$arr["class"]]["color"]))
        {
            $sbss->settings->requestClasses[$arr["class"]]["color"] = "ffffff";
        }

        if(!isset($sbss->settings->statusList[$arr["status"]]["descr"]))
        {
            $sbss->settings->statusList[$arr["status"]]["descr"] = "000000";
        }

        $tpl->setCurrentBlock("ticket_item");
        $tpl->syncBlockLocalize("ticket_item");
        $tpl->setVariable("THISTID", $arr["id"]);
        $tpl->setVariable("TRCOLOR", $sbss->settings->requestClasses[$arr["class"]]["color"]);
        $tpl->setVariable("STATUSCOLOR", $sbss->settings->statusList[$arr["status"]]["color"]);
        $tpl->setVariable("THISSTATUS", $sbss->settings->statusList[$arr["status"]]["descr"]);
        $tpl->setVariable("THISTITLE", empty($arr["name"]) ? SUBJECTEMPTY : $arr["name"]);

        // If author is manager
        if($arr["aType"] == 0)
        {
            $tpl->setVariable("THISAUTHOR", $sbss->settings->managerList[$arr["aId"]]["name"]);
            $tpl->touchBlock("authorManager");
            // Set email to send if exists
            if(empty($sbss->settings->managerList[$arr["aId"]]["email"]))
                $tpl->setVariable("MAILTOAUTHOR", MENU_NOT_ALLOWED);
            else
            {
                $tpl->setCurrentBlock("authorEMail");
                $tpl->setVariable("AUTHORMAIL", $sbss->settings->managerList[$arr["aId"]]["email"]);
                $tpl->parseCurrentBlock();
            }
        }
        else
        {
            $tpl->setVariable("THISAUTHOR", $sbss->settings->clientList[$arr["aId"]]["name"]);
            $tpl->setVariable("THISUSERID", $arr["aId"]);
            $tpl->touchBlock("authorClient");
            // Set email to send if exists
            if(empty($sbss->settings->clientList[$arr["aId"]]["email"]))
                $tpl->setVariable("MAILTOAUTHOR", MENU_NOT_ALLOWED);
            else
            {
                $tpl->setCurrentBlock("authorEMail");
                $tpl->setVariable("AUTHORMAIL", $sbss->settings->clientList[$arr["aId"]]["email"]);
                $tpl->parseCurrentBlock();
            }
        }

        $tpl->setVariable("THISPERSONID", $arr["aId"]);
        $tpl->setVariable("THISAUTHORTIME", $arr["created"]);
        $tpl->setVariable("THISREPLIES", $arr["replies"]);

        if($arr["respType"] == 0)
            $tpl->setVariable("THISANSWERNAME", $sbss->settings->managerList[$arr["respId"]]["name"]);
        else $tpl->setVariable("THISANSWERNAME", $sbss->settings->clientList[$arr["aId"]]["name"]);

        $tpl->setVariable("THISANSWERTIME", $arr["last"]);
        $tpl->setVariable("THISRESPONSIBLE", $sbss->settings->managerList[$arr["man"]]["name"]);

        if($arr["lock"] != "")
        {
            $tpl->setCurrentBlock("man_lock");
            $tpl->syncBlockLocalize("man_lock");
            $tpl->setVariable("MANVIEW", $sbss->settings->managerList[$arr["lock"]]["name"]);
            $tpl->parseCurrentBlock();
        }
        else $tpl->touchBlock("none_man_lock");

        if(!empty($arr["files"]))
        {
            $tpl->setCurrentBlock("ticket_item_att");
            $tpl->setVariable("THISATTACHEDCOUNT", $arr["files"]);
            $tpl->parseCurrentBlock();
        }

        $tpl->parse("ticket_item");
    }
} // end ticketItems()


/**
 * Create new ticket and post from the administrative interface
 * @param   object sbss
 */
function createTicket( &$sbss, &$localize )
{
    $tpl = new HTML_Template_IT(TPLS_PATH);
    $tpl->loadTemplatefile("sbssPosts.tpl",true,true);
    $tpl->setVariable("TICKETID", 0);
    $tpl->setVariable("POSTID", 0);
    $tpl->setVariable("CURT_STATUS", 0);

    // Print error message if they ware
    if(!empty($sbss->errors))
    {
        $Error = true;
        foreach($sbss->errors as $errorText)
        {
            $tpl->setCurrentBlock("erroRow");
            $tpl->syncBlockLocalize("erroRow");
            $tpl->setVariable("ERRORMESSAGE", $errorText);
            $tpl->parseCurrentBlock();
        }

        $tpl->syncBlockLOcalize("errorShow");
        $tpl->parse("errorShow");
    }

    // Show Controls
    $tpl->touchBlock("allowAddPost");
    $tpl->setCurrentBlock("saveData");
    $tpl->syncBlockLocalize("saveData");
    $tpl->parseCurrentBlock();
    $tpl->setCurrentBlock("attachData");
    $tpl->syncBlockLocalize("attachData");
    $tpl->parseCurrentBlock();
    $tpl->setCurrentBlock("assocToUser");
    $tpl->syncBlockLocalize("assocToUser");
    $tpl->parseCurrentBlock();

    $tpl->setCurrentBlock("newPost");
    $tpl->syncBlockLocalize("newPost");

    // Statuses array
    if(sizeof($sbss->settings->statusList) > 0)
    {
        foreach($sbss->settings->statusList as $key => $arr)
        {
            if($arr["active"] != 1 || $arr["type"] == 3) continue;

            $tpl->setCurrentBlock("statusList");
            $tpl->setVariable("STATUSID", $key);
            $tpl->setVariable("STATUSNAME", $arr["descr"]);
            if($_POST["status"] == $key) $tpl->touchBlock("statusListSel");
            $tpl->parseCurrentBlock();
        }
    }

    // Responsible men array
    if(sizeof($sbss->settings->managerList) > 0)
    {
        foreach($sbss->settings->managerList as $key => $arr)
        {
            $tpl->setCurrentBlock("manList");
            $tpl->setVariable("MANID", $key);
            $tpl->setVariable("MANNAME", $key . '. ' . $arr["name"]);

            if($Error)
            {
                if($_POST["man"] == $key) $tpl->touchBlock("manListSel");
            }
            else
            {
                if($_SESSION["auth"]["authperson"] == $key) $tpl->touchBlock("manListSel");
            }
            $tpl->parseCurrentBlock();
        }
    }

    // Request classes array
    if(sizeof($sbss->settings->requestClasses) > 0)
    {
        foreach($sbss->settings->requestClasses as $key => $arr)
        {
            $tpl->setCurrentBlock("requestList");
            $tpl->setVariable("REQUESTID", $key);
            $tpl->setVariable("REQUESTNAME", $arr["descr"]);
            if($_POST["reqClass"] == $key) $tpl->touchBlock("requestListSel");
            $tpl->parseCurrentBlock();
        }
    }

    $tpl->setVariable("TICKETSUBJ", $_POST["name"]);
    $tpl->setVariable("POSTTEXT", $_POST["text"]);

    if(!empty($_POST["fileDescr"]))
        $tpl->setVariable("FILEDESCR", $_POST["fileDescr"]);
    else $tpl->touchBlock("attachFormNone");

    if(isset($_POST["spec"])) $tpl->touchBlock("isSpec");

    $tpl->syncBlockLocalize("fullPostControl");
    $tpl->parse("fullPostControl");
    $tpl->setVariable("ROWSPANVALUE", 5);
    $tpl->touchBlock("KBCopyNone");

    $tpl->setCurrentBlock("asClient");
    $tpl->syncBlockLocalize("asClient");
    $tpl->touchBlock("asClientHid");
    $tpl->parseCurrentBlock();

    // Show manager's list
    showEmailSendTo($sbss, $tpl);

    $tpl->parse("newPost");
    $tpl->syncBlockLOcalize();

    $localize->compile($tpl->get(), true);
} // end createTicket()


/**
 * Show manager's list to send email to if checked
 * @param   object, sbss class
 * @param   object, template class
 */
function showEmailSendTo( &$sbss, &$tpl )
{
    $rowMax = ceil(sizeof($sbss->settings->managerList) / 3);
    $men = array_keys($sbss->settings->managerList);
    $iter = 0;

    if($rowMax == 0) return;

    // Build rows
    for($row = 0; $row < $rowMax; $row++)
    {
        for($col = 0; $col < 3; $col++)
        {
            if(isset($men[$iter]))
            {
                $tpl->setCurrentBlock("dupColCheck");
                $tpl->setVariable("MANAGERID", $men[$iter]);
                $tpl->setVariable("MANAGERNAME", $men[$iter] . '. ' .$sbss->settings->managerList[$men[$iter]]["name"]);
                $tpl->parseCurrentBlock();
            }
            else {
                $tpl->touchBlock("emptyDupCol");
            }

            $tpl->parse("dupCol");

            $iter++;
        }
        $tpl->parse("mailDup");
    }

    $tpl->syncBlockLocalize("showMailCopy");
    $tpl->parse("showMailCopy");
} // end showEmailSendTo()


/**
 * This function save new ticket with new post or add new post to the existing ticket
 * SBSS class function need data structure array to save to DB
 * @param   object sbss class
 */
function saveTicket( &$sbss )
{
    $sbssFiles = new SBSSFiles($sbss->connection);
    $sbssFiles->settings = $sbss->settings;
    $sbss->mailInfo = array();

    if(empty($_POST["name"]))
    {
        $sbss->errors[] = NEEDSUBJECT;
        return false;
    }

    // Before all check if save ixisting or new
    if(empty($_POST["ticketId"]))
        define("NEWTICKET", true);

    // New ticket Entry
    if(defined("NEWTICKET"))
    {
        // If there was request to create ticket as user
        if(isset($_POST["uId"]) && (integer) $_POST["uId"] > 0)
        {
            $Tstruct["aType"] = 1;
            $Tstruct["aId"] = $_POST["uId"];
        }
        else
        {
            $Tstruct["aType"] = 0;
            $Tstruct["aId"] = $_SESSION["auth"]["authperson"];
        }

        if(isset($_POST["vgId"]) && (integer) $_POST["vgId"] > 0)
            $Tstruct["vgid"] = $_POST["vgId"];

        $Tstruct["created"] = "@NOW()@";
        $Tstruct["last"] = "@created_on@";
        $Tstruct["respType"] = "@author_type@";
        $Tstruct["respId"] = "@author_id@";
    }
    // Existing ticket entry
    else
    {
        $Tstruct["aType"] = "@author_type@";
        $Tstruct["aId"] = "@author_id@";
        $Tstruct["created"] = "@created_on@";
        $Tstruct["last"] = "@NOW()@";
        $Tstruct["respType"] = 0;
        $Tstruct["respId"] = $_SESSION["auth"]["authperson"];

        if(!empty($_POST["text"]) && !isset($_POST["spec"]))
            $Tstruct["replies"] = "@replies+1@";
    }

    $Tstruct["id"] = $_POST["ticketId"];
    $Tstruct["name"] = $_POST["name"];
    $Tstruct["status"] = $_POST["status"];
    $Tstruct["man"] = $_POST["man"];
    $Tstruct["class"] = $_POST["reqClass"];
    $Tstruct["lock"] = "@NULL@";

    // Start strunsaction
    mysql_query("BEGIN", $sbss->connection);
    // Save ticket information
    if( false == ($TicketId = $sbss->saveTicket($Tstruct)) )
    {
        $sbss->errors[] = MESSAGESAVEERROR . ". " . WEBSERVERLOG;
        mysql_query("ROLLBACK", $sbss->connection);
        return false;
    }
    unset($Tstruct);

    // If ticket edit, just add new post
    if(!defined("NEWTICKET"))
    {
        // Detect if status ID was changes
        if($_POST["defStatus"] != $_POST["status"])
        {
            if(!defined("HD_ST_CHANGE"))
                $statusChanged = "Status changed to: ";
            else $statusChanged = HD_ST_CHANGE;

            $Pstruct["id"] = $_POST["postId"];
            $Pstruct["ticketId"] = $TicketId;
            $Pstruct["aType"] = 0;
            $Pstruct["aId"] = $_SESSION["auth"]["authperson"];
            $Pstruct["created"] = "@NOW()@";
            $Pstruct["text"] = $statusChanged . $sbss->settings->statusList[$_POST["status"]]["descr"];
            $Pstruct["spec"] = 1;

            if( false == ($PostId = $sbss->savePost($Pstruct)) )
            {
                $sbss->errors[] = MESSAGESAVEERROR . ". " . WEBSERVERLOG;
                mysql_query("ROLLBACK", $sbss->connection);
                return false;
            }
        }

        // Detect if Responsible Man was changed
        if($_POST["defMan"] != $_POST["man"])
        {
            if(!defined("HD_CHANGE_MAN"))
                $statusChanged = "Ticket superviser changed to: ";
            else $statusChanged = HD_CHANGE_MAN . ": ";

            $Pstruct["id"] = $_POST["postId"];
            $Pstruct["ticketId"] = $TicketId;
            $Pstruct["aType"] = 0;
            $Pstruct["aId"] = $_SESSION["auth"]["authperson"];
            $Pstruct["created"] = "@NOW()@";
            $Pstruct["text"] = $statusChanged . $sbss->settings->managerList[$_POST["man"]]["name"];
            $Pstruct["spec"] = 1;

            if( false == ($PostId = $sbss->savePost($Pstruct)) )
            {
                $sbss->errors[] = MESSAGESAVEERROR . ". " . WEBSERVERLOG;
                mysql_query("ROLLBACK", $sbss->connection);
                return false;
            }

            $mailIter = sizeof($sbss->mailInfo);
            // Remember infomation for the mail system
            $sbss->mailInfo[$mailIter]["subject"] = sprintf(HELPDESKMAIL_SUBJ_0, $TicketId);
            $sbss->mailInfo[$mailIter]["message"] = sprintf(HELPDESKMAIL_BODY_0, $_POST["name"], $TicketId, $sbss->settings->managerList[$_POST["man"]]["name"], $sbss->settings->managerList[$_SESSION["auth"]["authperson"]]["name"]);
            $sbss->mailInfo[$mailIter]["to"] = $sbss->settings->managerList[$_POST["man"]]["email"];
        }
    }

    // If not empty message control, than save it to DB
    if(!empty($_POST["text"]))
    {
        $Pstruct["id"] = $_POST["postId"];
        $Pstruct["ticketId"] = $TicketId;
        $Pstruct["aType"] = 0;
        $Pstruct["aId"] = $_SESSION["auth"]["authperson"];
        $Pstruct["created"] = "@NOW()@";
        $Pstruct["text"] = $_POST["text"];
        $Pstruct["spec"] = (int) $_POST["spec"];

        if( false == ($PostId = $sbss->savePost($Pstruct)) )
        {
            $sbss->errors[] = MESSAGESAVEERROR . ". " . WEBSERVERLOG;
            mysql_query("ROLLBACK", $sbss->connection);
            return false;
        }

        if(isset($_POST["emailTo"]) && sizeof($_POST["emailTo"]) > 0)
        {
            $mailIter = sizeof($sbss->mailInfo);
            // Remember infomation for the mail system
            $sbss->mailInfo[$mailIter]["subject"] = sprintf(HELPDESKMAIL_SUBJ_1, $TicketId);
            $sbss->mailInfo[$mailIter]["message"] = sprintf(HELPDESKMAIL_BODY_1, $sbss->settings->managerList[$_SESSION["auth"]["authperson"]]["name"], $_POST["name"], $TicketId, $Pstruct["text"]);

            foreach($_POST["emailTo"] as $mKey)
            {
                if(isset($sbss->settings->managerList[$mKey]["email"]) && !empty($sbss->settings->managerList[$mKey]["email"]))
                    $sbss->mailInfo[$mailIter]["to"][] = $sbss->settings->managerList[$mKey]["email"];
            }
        }

        // If there was controls to copy message to knowledge base
        if(isset($_POST["kbId"]) && isset($_POST["kbName"]) && $_POST["kbId"] >= 0 && !empty($_POST["kbName"]))
        {
            $know = new Knowledge($sbss->connection);
            $know->settings = $sbss->settings;
            // If need create new item
            if($_POST["kbId"] > 0)
            {
                $Kstruct["id"] = $_POST["kbId"];
                $Kstruct["last"] = "@NOW()@";
                $Kstruct["respType"] = 0;
                $Kstruct["respId"] = $_SESSION["auth"]["authperson"];
            }
            else
            {
                $Kstruct["id"] = 0;
                $Kstruct["name"] = $_POST["kbName"];
                $Kstruct["aType"] = 0;
                $Kstruct["aId"] = $_SESSION["auth"]["authperson"];
                $Kstruct["created"] = "@NOW()@";
                $Kstruct["last"] = "@created_on@";
                $Kstruct["respType"] = "@author_type@";
                $Kstruct["respId"] = "@author_id@";
                $Kstruct["class"] = $_POST["reqClass"];
            }

            // Save Knowledge information
            if( false == ($KnowledgeId = $know->saveKnowledge($Kstruct)) )
            {
                $sbss->errors[] = MESSAGESAVEERROR . ". " . WEBSERVERLOG;
                mysql_query("ROLLBACK", $sbss->connection);
                return false;
            }

            $Pstruct["id"] = 0;
            $Pstruct["knowledgeId"] = $KnowledgeId;

            if( false == ($KnowPostId = $know->saveKnowledgePost($Pstruct)) )
            {
                $sbss->errors[] = MESSAGESAVEERROR . ". " . WEBSERVERLOG;
                mysql_query("ROLLBACK", $sbss->connection);
                return false;
            }
        }
    }

    // Save attached files on disk if they exist
    switch ($sbssFiles->preUploadCheck("attach"))
    {
        case true:
            foreach($sbssFiles->files as $fileData)
            {
                $Fstructure["name"] = $fileData["name"];
                $Fstructure["size"] = $fileData["size"];
                $Fstructure["ticketId"] = $TicketId;
                $Fstructure["postId"] = $PostId;
                $Fstructure["descr"] = $_POST["fileDescr"];

                if(isset($fileData["id"]) && !empty($fileData["id"]))
                {
                    $Fstructure["id"] = $fileData["id"];
                    $Fstructure["edit"] = "@NOW()@";
                    $Fstructure["editType"] = 0;
                    $Fstructure["editId"] = $_SESSION["auth"]["authperson"];
                }
                else
                {
                    $Fstructure["created"] = "@NOW()@";
                    $Fstructure["aType"] = 0;
                    $Fstructure["aId"] = $_SESSION["auth"]["authperson"];
                    $Fstructure["edit"] = "@created_on@";
                    $Fstructure["editType"] = "@author_type@";
                    $Fstructure["editId"] = "@author_id@";
                }

                if( false != ($fileId = $sbssFiles->attachPostFile($Fstructure)) )
                {
                    if( !$sbssFiles->saveFile($fileData["tmp_name"], $sbss->settings->commonSettings["sbss_ticket_files"] . "/" . sprintf($sbssFiles->postFileTemplate, $fileId)) )
                    {
                        $sbss->errors[] = FOLDERDENY . ". " . WEBSERVERLOG;
                        mysql_query("ROLLBACK", $sbss->connection);
                        return false;
                    }
                }
                else
                {
                    $sbss->errors[] = MESSAGESAVEERROR . ". " . WEBSERVERLOG;
                    mysql_query("ROLLBACK", $sbss->connection);
                    return false;
                }

                // If there was controls to copy message to knowledge base
                if(isset($_POST["kbId"]) && isset($_POST["kbName"]) && $_POST["kbId"] >= 0 && !empty($_POST["kbName"]) &&
                    !isset($fileData["id"]) && empty($fileData["id"]))
                {
                    if($KnowPostId != false && $KnowPostId > 0)
                    {
                        $Fstructure["postId"] = $KnowPostId;
                        $Fstructure["knowledgeId"] = $KnowledgeId;

                        if( false != ($Kfile = $sbssFiles->attachKnowledgeFile($Fstructure)) )
                        {
                            if( !$sbssFiles->copyFile($sbss->settings->commonSettings["sbss_ticket_files"] . "/" . sprintf($sbssFiles->postFileTemplate, $fileId), $sbss->settings->commonSettings["sbss_ticket_files"] . "/" . sprintf($sbssFiles->knowledgeFileTemplate, $Kfile)) )
                            {
                                $sbss->errors[] = FOLDERDENY . ". " . WEBSERVERLOG;
                                mysql_query("ROLLBACK", $sbss->connection);
                                return false;
                            }
                        }
                        else
                        {
                            $sbss->errors[] = MESSAGESAVEERROR . ". " . WEBSERVERLOG;
                            mysql_query("ROLLBACK", $sbss->connection);
                            return false;
                        }
                    }
                }
            }
        break;
    }

    mysql_query("COMMIT", $sbss->connection);
    return true;
} // end


/**
 * Show post's list and attached file to them for the selected ticket.
 * @param   object sbss class
 */
function showPosts( &$sbss, &$localize )
{
    // Load post list template file for parsing
    $tpl = new HTML_Template_IT(TPLS_PATH);

    $tpl->loadTemplatefile("sbssPostsAsync.tpl",true,true);
    $tpl->setVariable('TICKETSTRUCT', json_encode(getPostsDataJSON($sbss, $localize)));
    $tpl->show();
    return;

    $tpl->loadTemplatefile("sbssPosts.tpl",true,true);
    $tpl->setVariable("TICKETID", $_POST["ticketId"]);

    // Print error message if they ware
    if(!empty($sbss->errors))
    {
        $Error = true;
        foreach($sbss->errors as $errorText)
        {
            $tpl->setCurrentBlock("erroRow");
            $tpl->syncBlockLocalize("erroRow");
            $tpl->setVariable("ERRORMESSAGE", $errorText);
            $tpl->parseCurrentBlock();
        }

        $tpl->parse("errorShow");
    }

    // Get selected ticket information
    $filter = array("ticketId" => $_POST["ticketId"]);
    $ticket = $sbss->getTickets($filter, 0, 1, 0);

    // Send unlock on action
    if(isset($_POST["blocked"]) && isset($_POST["blockTicket"]))
    {
        $Tstruct["id"] = $_POST["ticketId"];
        $Tstruct["lock"] = "@NULL@";

        mysql_query("BEGIN", $sbss->connection);
        if( false == $sbss->saveTicket($Tstruct) )
        {
            mysql_query("ROLLBACK", $sbss->connection);
            return false;
        }

        mysql_query("COMMIT", $sbss->connection);
        $ticket[0]["lock"] = "";
    }

    if(((!isset($_POST["blocked"]) && !isset($_POST["blockTicket"])) ||
        (isset($_POST["blocked"]) && isset($_POST["blockTicket"]))) &&
        $ticket[0]["lock"] == "")
    {
        $tpl->setCurrentBlock("setBlock");
        $tpl->syncBlockLocalize("setBlock");
        $tpl->parseCurrentBlock();

        define("ALLOWTOEDIT", 2);
    }
    elseif($ticket[0]["lock"] == "" || $ticket[0]["lock"] == $_SESSION["auth"]["authperson"])
    {
        define("ALLOWTOEDIT", 1);

        $tpl->touchBlock("allowAddPost");
        $tpl->setCurrentBlock("saveData");
        $tpl->syncBlockLocalize("saveData");
        $tpl->parseCurrentBlock();
        $tpl->setCurrentBlock("attachData");
        $tpl->syncBlockLocalize("attachData");
        $tpl->parseCurrentBlock();
        $tpl->setCurrentBlock("setKBCopy");
        $tpl->syncBlockLocalize("setKBCopy");
        $tpl->parseCurrentBlock();
        $tpl->setCurrentBlock("setUnBlock");
        $tpl->syncBlockLocalize("setUnBlock");
        $tpl->parseCurrentBlock();

        // Send lock to DB
        if(isset($_POST["blockTicket"]))
        {
            $Tstruct["id"] = $_POST["ticketId"];
            $Tstruct["lock"] = $_SESSION["auth"]["authperson"];

            mysql_query("BEGIN", $sbss->connection);
            if( false == $sbss->saveTicket($Tstruct) )
            {
                echo "Lock error";
                mysql_query("ROLLBACK", $sbss->connection);
                return false;
            }
            mysql_query("COMMIT", $sbss->connection);
        }
    }
    else define("ALLOWTOEDIT", 0);

    $tpl->setCurrentBlock("postsList");
    $tpl->syncBlockLocalize("postsList");
    $tpl->setVariable("TICKET_TITLE", $ticket[0]["name"]);
    $tpl->setVariable("STATUSNAME", $sbss->settings->statusList[$ticket[0]["status"]]["descr"]);

    if($ticket[0]["vgid"] > 0)
    {
        $tpl->setCurrentBlock("ToVG");
        $tpl->syncBlockLocalize("ToVG");
        $tpl->setVariable("ASSOCVALUE", $sbss->vgroupsList[$ticket[0]["vgid"]]["login"] . ", " . $sbss->vgroupsList[$ticket[0]["vgid"]]["service_name"]);
        $tpl->parseCurrentBlock();
    }

    $posts = $sbss->getPosts($_POST["ticketId"]);
    if(empty($posts))
    {
        $tpl->setCurrentBlock("rowPostEmpty");
        $tpl->syncBlockLocalize("rowPostEmpty");
        $tpl->parseCurrentBlock();
    }
    else
    {
        foreach($posts as $key => $arr)
        {
            $tpl->setCurrentBlock("rowTitle");
            $tpl->syncBlockLocalize("rowTitle");


            if($arr["aType"] != 1)
            {
                $tpl->setVariable("AUTHORNAME", $sbss->settings->managerList[$arr["aId"]]["name"]);
            }
            else
            {
                $tpl->setVariable("AUTHORNAME", $sbss->settings->clientList[$arr["aId"]]["name"]);
                $tpl->setVariable("THISPERSONID", $arr["aId"]);
            }

            $tpl->setVariable("CREATEDDATE", $arr["created"]);
            $tpl->setVariable("THISPOSTID", $key);
            $tpl->parseCurrentBlock();

            if($arr["spec"] > 0)
            {
                $tpl->setCurrentBlock("rowSpec");
                $tpl->syncBlockLocalize("rowSpec");
                $tpl->setVariable("SPECTEXT", $arr["text"]);
                $tpl->setCurrentBlock();
            }
            else
            {
                $tpl->setCurrentBlock("rowMess");
                $tpl->syncBlockLocalize("rowMess");
                $tpl->setVariable("ROWTEXT", $arr["text"]);
                $tpl->setCurrentBlock();
            }

            // Check for the attached files
            if(!empty($arr["attach"]))
            {
                $tpl->setCurrentBlock("rowFile");
                $tpl->syncBlockLocalize("rowFile");
                $tpl->setVariable("ISATTACHED", sizeof($arr["attach"]));

                foreach($arr["attach"] as $fKey => $fArr)
                {
                    $tpl->setCurrentBlock("rowFileItem");
                    $tpl->setVariable("THIS_FL_TID", $_POST["ticketId"]);
                    $tpl->setVariable("THIS_FL_ID", $fKey);
                    $tpl->setVariable("THIS_FL_CREATED", $fArr["created"]);
                    $tpl->setVariable("THIS_FL_EDIT", $fArr["edited"]);

                    if($fArr["aType"] == 0)
                        $tpl->setVariable("THIS_FL_AUTHOR", $sbss->settings->managerList[$fArr["aId"]]["name"]);
                    else $tpl->setVariable("THIS_FL_AUTHOR", $sbss->settings->clientList[$fArr["aId"]]["name"]);

                    $tpl->setVariable("THIS_FL_DESCR", $fArr["descr"]);
                    $tpl->setVariable("THIS_FL_FILE", $fArr["name"]);
                    $tpl->setVariable("THIS_FL_SIZE", sprintf("%.02f", $fArr["size"] / 1024));
                    $tpl->parseCurrentBlock();
                }

                $tpl->parse("rowFile");
            }

            $tpl->parse("row");
        }
    }

    $tpl->parse("postsList");
    $tpl->setVariable("HD_CREATE_TIKET", HD_ADD_POST);

    if(ALLOWTOEDIT == 1)
    {
        $tpl->setVariable("CURT_STATUS", $ticket[0]["status"]);
        $tpl->setVariable("CURT_MAN", $ticket[0]["man"]);

        $tpl->setCurrentBlock("newPost");
        $tpl->syncBlockLocalize("newPost");

        // Statuses array
        if(sizeof($sbss->settings->statusList) > 0)
        {
            foreach($sbss->settings->statusList as $key => $arr)
            {
                if($arr["active"] != 1 || $arr["type"] == 3) continue;

                $tpl->setCurrentBlock("statusList");
                $tpl->setVariable("STATUSID", $key);
                $tpl->setVariable("STATUSNAME", $arr["descr"]);
                if($Error)
                {
                    if($_POST["status"] == $key) $tpl->touchBlock("statusListSel");
                }
                else
                {
                    if($ticket[0]["status"] == $key) $tpl->touchBlock("statusListSel");
                }
                $tpl->parseCurrentBlock();
            }
        }

        // Responsible men array
        if(sizeof($sbss->settings->managerList) > 0)
        {
            foreach($sbss->settings->managerList as $key => $arr)
            {
                $tpl->setCurrentBlock("manList");
                $tpl->setVariable("MANID", $key);
                $tpl->setVariable("MANNAME", $arr["name"]);
                if($Error)
                {
                    if($_POST["man"] == $key) $tpl->touchBlock("manListSel");
                }
                else
                {
                    if($ticket[0]["man"] == $key) $tpl->touchBlock("manListSel");
                }
                $tpl->parseCurrentBlock();
            }
        }

        // Request classes array
        if(sizeof($sbss->settings->requestClasses) > 0)
        {
            foreach($sbss->settings->requestClasses as $key => $arr)
            {
                $tpl->setCurrentBlock("requestList");
                $tpl->setVariable("REQUESTID", $key);
                $tpl->setVariable("REQUESTNAME", $arr["descr"]);
                if($Error)
                {
                    if($_POST["reqClass"] == $key) $tpl->touchBlock("requestListSel");
                }
                else
                {
                    if($ticket[0]["class"] == $key) $tpl->touchBlock("requestListSel");
                }
                $tpl->parseCurrentBlock();
            }
        }

        if($Error)
        {
            $tpl->setVariable("TICKETSUBJ", htmlspecialchars($_POST["name"], ENT_QUOTES));
            $tpl->setVariable("POSTTEXT", htmlspecialchars($_POST["text"], ENT_QUOTES));
        }
        else $tpl->setVariable("TICKETSUBJ", htmlspecialchars($ticket[0]["name"], ENT_QUOTES));

        if(!empty($_POST["fileDescr"]))
            $tpl->setVariable("FILEDESCR", $_POST["fileDescr"]);
        else $tpl->touchBlock("attachFormNone");

        if(isset($_POST["spec"])) $tpl->touchBlock("isSpec");

        $tpl->syncBlockLocalize("fullPostControl");
        $tpl->parse("fullPostControl");

        $tpl->touchBlock("KBCopyNone");
        $tpl->setCurrentBlock("emptySubj");
        $tpl->syncBlockLocalize("emptySubj");
        $tpl->parseCurrentBlock();
        $tpl->parse("toKB");

        $tpl->setVariable("ROWSPANVALUE", 5);

        // Show manager's list
        showEmailSendTo($sbss, $tpl);

        $tpl->parse("newPost");
    }

    $tpl->syncBlockLocalize();
    // Change default page titles if not allowed message add
    if(ALLOWTOEDIT == 0) $tpl->setVariable("HD_CREATE_TIKET", TICKETVIEWBY . ": " . $sbss->settings->managerList[$ticket[0]["lock"]]["name"]);
    else $tpl->setVariable("HD_CREATE_TIKET", HD_ADD_POST . " / " . CHANGESTATUS);

    $localize->compile($tpl->get(), true);
} // end showPosts()


/**
 * Create new ticket and post from the administrative interface
 * @param   object sbss
 */
function editPost( &$sbss, &$localize )
{
    $tpl = new HTML_Template_IT(TPLS_PATH);
    $tpl->loadTemplatefile("sbssPosts.tpl",true,true);
    $tpl->setVariable("TICKETID", $_POST["ticketId"]);

    // Print error message if they ware
    if(!empty($sbss->errors))
    {
        $Error = true;
        foreach($sbss->errors as $errorText)
        {
            $tpl->setCurrentBlock("erroRow");
            $tpl->syncBlockLocalize("erroRow");
            $tpl->setVariable("ERRORMESSAGE", $errorText);
            $tpl->parseCurrentBlock();
        }

        $tpl->parse("errorShow");
    }

    // Set hidden value to post id
    $tpl->setCurrentBlock("ticketEditHid");
    $tpl->setVariable("EDITPOST", $_POST["editPostId"]);
    $tpl->parseCurrentBlock();

    // Get selected ticket information
    $filter = array("ticketId" => $_POST["ticketId"]);
    $ticket = $sbss->getTickets($filter, 0, 0, 0);
    // Current post data
    $posts = $sbss->getPosts($_POST["ticketId"], $_POST["editPostId"]);

    // Show Controls
    $tpl->setCurrentBlock("saveData");
    $tpl->syncBlockLocalize("saveData");
    $tpl->parseCurrentBlock();
    $tpl->setCurrentBlock("attachData");
    $tpl->syncBlockLocalize("attachData");
    $tpl->parseCurrentBlock();

    $tpl->setCurrentBlock("newPost");

    $tpl->setCurrentBlock("nonePostControl");
    $tpl->syncBlockLocalize("nonePostControl");
    $tpl->parseCurrentBlock();

    if($Error)
    {
        $tpl->setVariable("TICKETSUBJ", htmlspecialchars($_POST["name"], ENT_QUOTES));
        $tpl->setVariable("POSTTEXT", htmlspecialchars($_POST["text"], ENT_QUOTES));
    }
    else
    {
        $tpl->setVariable("TICKETSUBJ", htmlspecialchars($ticket[0]["name"], ENT_QUOTES));
        $tpl->setVariable("POSTTEXT", htmlspecialchars($posts[$_POST["editPostId"]]["text"], ENT_QUOTES));
    }

    if(!empty($posts[$_POST["editPostId"]]["attach"]))
    {
        foreach($posts[$_POST["editPostId"]]["attach"] as $fKey => $fArr)
        {
            $tpl->setCurrentBlock("fileToEdit");
            $tpl->setVariable("EDITFILEID", $fKey);
            $tpl->parseCurrentBlock();

            $tpl->setCurrentBlock("fileInfo");
            $tpl->syncBlockLocalize("fileInfo");
            $tpl->setVariable("THISCRMFILEDESRC", $fArr["descr"]);
            $tpl->setVariable("THISFILEORIGINALNAME", $fArr["name"]);
            $tpl->setVariable("THISFILESIZE", sprintf("%.02f", $fArr["size"] / 1024));
            $tpl->parseCurrentBlock();
        }
    }
    else $tpl->touchBlock("nonePostControl");

    if($posts[$_POST["editPostId"]]["spec"] == 1)
        $tpl->touchBlock("isSpec");

    if(!empty($_POST["fileDescr"]))
        $tpl->setVariable("FILEDESCR", $_POST["fileDescr"]);
    else $tpl->touchBlock("attachFormNone");

    $tpl->setVariable("ROWSPANVALUE", 3);
    $tpl->touchBlock("KBCopyNone");
    $tpl->syncBlockLocalize("newPost");
    $tpl->parse("newPost");

    $tpl->syncBlockLocalize();
    $localize->compile($tpl->get(), true);
} // end editPost()


/**
 * Save edited post
 *
 */
function saveSelectedPost( &$sbss )
{
    $sbssFiles = new SBSSFiles($sbss->connection);
    $sbssFiles->settings = $sbss->settings;

    // Start strunsaction
    mysql_query("BEGIN", $sbss->connection);
    if(!empty($_POST["text"]))
    {
        $Pstruct["id"] = $_POST["editPostId"];
        $Pstruct["ticketId"] = $_POST["ticketId"];
        $Pstruct["text"] = $_POST["text"];
        $Pstruct["spec"] = (int) $_POST["spec"];

        if( false == ($PostId = $sbss->savePost($Pstruct)) )
        {
            $sbss->errors[] = MESSAGESAVEERROR . ". " . WEBSERVERLOG;
            mysql_query("ROLLBACK", $sbss->connection);
            return false;
        }
    }

    // Save attached files on disk if they exists
    switch($sbssFiles->preUploadCheck("attach"))
    {
        case true:
            foreach($sbssFiles->files as $fileData)
            {
                $Fstructure["name"] = $fileData["name"];
                $Fstructure["size"] = $fileData["size"];
                $Fstructure["ticketId"] = $_POST["ticketId"];
                $Fstructure["postId"] = $PostId;
                $Fstructure["descr"] = $_POST["fileDescr"];

                if(isset($fileData["id"]) && !empty($fileData["id"]))
                {
                    $Fstructure["id"] = $fileData["id"];
                    $Fstructure["edit"] = "@NOW()@";
                    $Fstructure["editType"] = 0;
                    $Fstructure["editId"] = $_SESSION["auth"]["authperson"];
                }
                else
                {
                    $Fstructure["created"] = "@NOW()@";
                    $Fstructure["aType"] = 0;
                    $Fstructure["aId"] = $_SESSION["auth"]["authperson"];
                    $Fstructure["edit"] = "@created_on@";
                    $Fstructure["editType"] = "@author_type@";
                    $Fstructure["editId"] = "@author_id@";
                }

                if( false != ($fileId = $sbssFiles->attachPostFile($Fstructure)) )
                {
                    $sbssFiles->saveFile($fileData["tmp_name"], $sbss->settings->commonSettings["sbss_ticket_files"] . "/" . sprintf($sbssFiles->postFileTemplate, $fileId));
                }
                else
                {
                    $sbss->errors[] = MESSAGESAVEERROR . ". " . WEBSERVERLOG;
                    mysql_query("ROLLBACK", $sbss->connection);
                    return false;
                }
            }
        break;

        case null:
            if(isset($_POST["editPostId"]) && !empty($_POST["editPostId"]) && !empty($_POST["fileId"]))
            {
                foreach($sbssFiles->files as $fileData)
                {
                    $Fstructure["ticketId"] = $_POST["ticketId"];
                    $Fstructure["postId"] = $PostId;
                    $Fstructure["descr"] = $_POST["fileDescr"];
                    $Fstructure["edit"] = "@NOW()@";
                    $Fstructure["editType"] = 0;
                    $Fstructure["editId"] = $_SESSION["auth"]["authperson"];
                    $Fstructure["id"] = $_POST["fileId"];

                    if( false == ($fileId = $sbssFiles->attachPostFile($Fstructure)) )
                    {
                        $sbss->errors[] = MESSAGESAVEERROR . ". " . WEBSERVERLOG;
                        mysql_query("ROLLBACK", $sbss->connection);
                        return false;
                    }
                }
            }
        break;

        default: mysql_query("ROLLBACK", $sbss->connection);
             return false;
    }

    mysql_query("COMMIT", $sbss->connection);
    return true;
} // end saveSelectedPost()


/**
 * Delete message and attached file from the ticket
 * @param   object sbss class
 */
function deletePost( &$sbss )
{
    $sbssFiles = new SBSSFiles();
    $sbssFiles->settings = $sbss->settings;

    // Current post data, Need know if post is special
    $posts = $sbss->getPosts($_POST["ticketId"], $_POST["dropPostId"]);

    if(!$sbssFiles->removePostFiles($_POST["dropPostId"]))
        return false;

    mysql_query("BEGIN", $sbss->connection);
    if(!$sbss->deletePost($_POST["dropPostId"]))
    {
        $sbss->postList = array();
        $sbss->errors[] = WHILESAVEERROR . ". " . WEBSERVERLOG;
        mysql_query("ROLLBACK", $sbss->connection);
        return false;
    }

    if($posts[$_POST["dropPostId"]]["spec"] != 1)
    {
        $Tstruct["id"] = $_POST["ticketId"];
        $Tstruct["replies"] = "@replies-1@";

        if( false == $sbss->saveTicket($Tstruct) )
        {
            $sbss->postList = array();
            $sbss->errors[] = WHILESAVEERROR . ". " . WEBSERVERLOG;
            mysql_query("ROLLBACK", $sbss->connection);
            return false;
        }
    }

    $sbss->postList = array();
    mysql_query("COMMIT", $sbss->connection);
    return true;
} // end deletePost()


/**
 * Send email notification to users
 * @param   object billing class
 * @param   object sbss class
 */
function sendNotifications($lanbilling, $sbss)
{
    if($lanbilling->checkEmailAddress($sbss->settings->emailCSettings["crm_email_box"]))
        $mail_from = $sbss->settings->emailCSettings["crm_email_box"];
    else $mail_from = "";

    foreach($sbss->mailInfo as $array)
    {
        if(is_array($array["to"]) && sizeof($array["to"]) > 0)
        {
            foreach($array["to"] as $copyTo)
                $lanbilling->sendMailTo($mail_from, $copyTo, $array["subject"], $array["message"]);
        }
        else $lanbilling->sendMailTo($mail_from, $array["to"], $array["subject"], $array["message"]);
    }
} // end sendNotifications()

/**
 * Get user accounts info
 * @param   object billing class
 * @param   integer uid
 */
function getUserAccounts(&$lanbilling, $uid) {

    $filter = $lanbilling->soapFilter(array("archive" => 0, "userid" => $uid));
    $s = "";
    if( false != ($result = $lanbilling->get("getVgroups", array("flt" => $filter, "md5" => $lanbilling->controlSum($filter)))) ) {

        if(!empty($result)) {
            if(!is_array($result)) {
                $result = array($result);
            }
            foreach( $result as $account ) {
                if( !empty($s) )
                    $s .= ",";
                $addr = preg_replace('/\,+/', " ", $account->address->address);
                $s .= "['{$account->vgid}', '{$account->login}', '{$account->agrmnum}', '{$account->balance}', '{$account->blocked}', '{$addr}']";
            }

        }

    }

    echo "[{$s}]";

}//end getUserAccounts()
