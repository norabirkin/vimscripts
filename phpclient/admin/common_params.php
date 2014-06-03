<?php
// +----------------------------------------------------------------------
// | Copyright: See COPYING file that comes with this distribution
// +----------------------------------------------------------------------

error_reporting(7);

//Пункты меню
$menu = array(
        'objects'    => N_OBJECTS,
        'properties' => N_PROPERTIES,
        'actions'    => N_ACTIONS,
        'reports'    => N_REPORTS,
        'options'    => N_OPTIONS,
        'hd'         => 'HelpDesk',
        'exit'       => N_EXIT
      );

$menu_punkts['objects'] = array(
        'agents'   => AGENTS,
        'users'    => GROUPS1,
        'groups'   => USERVG,
        'accounts' => ACCOUNTGROUPS,
        'unions'   => USERGROUPS,
        'predstav' => PREDSTAV,
        'pay_card' => PAYCARDSBTN,
        'managers' => MANAGERS,
        'rate'     => RATE
      );

$menu_punkts['properties'] = array(
        'tars'     => TARIFFS,
        'catalog'  => CATALOG,
        'payments2'=> N_PAYMENTS,
        'politics' => N_POLITICS
      );

$menu_punkts['actions'] = array(
        'gen_card'    => N_GEN_CARD,
        'gen_schet'   => N_GEN_ORD,
        'gen_report'  => N_GEN_REP,
        'export_schet'=> N_EXP_ORD,
        'recalc'      => N_RECALC,
        'gen_tolink'  => N_GEN_TOLINK
      );

$menu_punkts['reports'] = array(
        'statistic' => STATISTICS,
        'schet'     => N_ACTS,
        'oper_schet'=> N_OPER,
        'logs'      => EVENTLOG,
        'authlog'   => AUTHLOG
      );

$menu_punkts['options'] = array(
        'comm_options'   => OPT_COMMON,
        'oper_properties'=> OPT_OPER,
        'pays_properties'=> OPT_PAYS,
        'templates'      => OPT_TEMPLATES
      );

$menu_punkts['hd'] = array(
        'hd_c'       => HD_TIKETS,
        'hd_create'  => HD_CREATE_TIKET,
        'hd_statuses'=> HD_STATUSES);

$search_users = array(
        1=>USERLOGIN,
           DESCRIPTION,
           EMAIL,
           FIO,
           AGREEMENT
        );

$search_vgroups = array(
        1=>LOGIN,
           DESCRIPTION,
           FIO,
           AGREEMENT
        );
