<?php

class LB_Usbox_Categories extends LB_Usbox {
    public function active() {
        $cache = new LB_Cache;
        if ($cached = $cache->get('usbox.categories.active', $this->params())) {
            return $cached;
        }
        $result = $this->unique(parent::active());
        $cache->set('usbox.categories.active', $this->params(), $result);
        return $result;
    }
    public function all($state = true) {
        $cache = new LB_Cache;
        if ($state) {
            $result = new LB_Usbox_Array_Categories($cache->index('catidx', parent::all()->data()));
            return $result;
        }
        $result = array();
        $tarifid = $this->tarifid ? $this->tarifid : $this->vgroup($this->vgid)->vgroup->tarifid;
        foreach ($this->tarCategories($tarifid) as $category) {
            if ($this->filter($category)) {
                $result[$category->catidx] = $this->process($category);
            }
        }
        return new LB_Usbox_Array_Categories($result);
    }
    public function scheduled() {
        $cache = new LB_Cache;
        if ($cached = $cache->get('usbox.categories.scheduled', $this->params())) {
            return $cached;
        }
        $result = $this->unique(parent::scheduled());
        $cache->set('usbox.categories.scheduled', $this->params(), $result);
        return $result;
    }
    private function filter($category) {
        return (
            (
                $this->unavail == -1
                OR
                ((bool) $category->available) == !((bool) $this->unavail)
            )
            AND
            (
                (
                    !$this->periodic
                    AND
                    (
                        $this->common == -1
                        OR
                        $category->common == $this->common
                    )
                )
                OR
                (
                    $this->periodic
                    AND
                    $category->common != 0
                )
            )
            AND
            (
                $this->dtvtype == -1
                OR
                $category->dtvtype == $this->dtvtype
            )
            AND
            (
                $this->keepturnedon == -1
                OR
                $category->keepturnedon == $this->keepturnedon
            )
            AND 
            (
                !$this->uuid
                OR
                $category->uuid == $this->uuid
            )
        );
    }
    private function process($category) {
        $agreement = $this->agreement($this->vgroup($this->vgid)->vgroup->agrmid);
        $category = clone $category;
        $category = $this->discounted($category);
        $category->blocked = $this->vgroup($this->vgid)->vgroup->blocked;
        $category->tarifdescr = $this->vgroup($this->vgid)->vgroup->tarifdescr;
        $category->vgid = $this->vgid;
        if ($category->above >= ($agreement->balance + $agreement->credit)) {
            $category->lowbalance = 1;
        } else {
            $category->lowbalance = 0;
        }
        $category->error = $this->error($category);
        return $category;
    }
    public function idle() {
        $cache = new LB_Cache;
        if ($cached = $cache->get('usbox.categories.idle', $this->params())) {
            return $cached;
        }
        $notIdle = array_merge($this->active()->keys(), $this->scheduled()->keys());
        $idle = array();
        foreach ($this->tarCategories($this->vgroup($this->vgid)->vgroup->tarifid) as $category) {
            if (
                !in_array($category->catidx, $notIdle)
                AND
                $this->filter($category)
            ) {
                $category = $this->process($category);
                $category->state = 'idle';
                $idle[] = $category;
            }
        }
        $result = new LB_Usbox_Array_Categories($cache->index('catidx', $idle));
        $cache->set('usbox.categories.idle', $this->params(), $result);
        return $result;
    }
    protected function rate($category) {
        return $this->g('getTarCategoryRate', array(
            'flt' => array(
                'vgid' => $this->vgid,
                'tarid' => $category->tarid,
                'catid' => $category->catidx
            )
        ));
    }
    public function unique($services) {
        $result = array();
        foreach ($services as $service) {
            $result[$service->service->catidx] = $service;
        }
        return new LB_Usbox_Array($result);
    }
    protected function errors() {
        $errors = parent::errors();
        $errors[] = 'lock';
        $errors[] = 'balance';
        return $errors;
    }
}

?>
