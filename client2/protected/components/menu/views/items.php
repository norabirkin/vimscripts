<ul class="sidebar-nav-<?php if ($sub) { ?>sub<?php } ?>menu">
    <?php foreach ($items as $item) { ?>
    <li class="nav-menu-item<?php if ($item['items']) { ?> normal-cursor<?php } ?>">
        <a class="nav-<?php if ($sub) { ?>sub<?php } ?>menu-link" href="<?php echo $item['url']; ?>">
            <?php echo $item['title']; ?>
        </a>
        <?php if ($item['items']) { 
            echo $component->render('items', array(
                'items' => $item['items'],
                'sub' => true
            ));
        } ?>
    </li>
    <?php } ?>
</ul>
