<?php class ZkhTest extends LBTestCase {
	  
	public function testVgroupsList() {
		$this->setLBFake();
		$ZKH = new ZKH;
		$vgroups = $ZKH->getVGroups();
		$expectedVgroups = $this->getExpected('VGroups');
		$this->assertEquals($vgroups, $expectedVgroups);
		$this->logOutput();
	}
	
	public function testRegistration() {
		$this->setLBFake();
		$ZKH = new ZKHRegistration;
		$registration = $ZKH->setVGroupID(1829)->setCategoryID(1)->getRegistration();
		$expectedLastRegistration = $this->getExpected('LastRegistration');
		$this->assertEquals($registration, $expectedLastRegistration);
		$this->logOutput();
	}
	
	public function testGetRegistrationWithNoRegistrationData() {
		$this->setLBFake();
		$ZKH = new ZKHRegistration;
		$registration = $ZKH->setVGroupID(1829)->setCategoryID(0)->getRegistration();
		$expectedLastRegistration = $this->getExpected('NoRegistration');
		$this->assertEquals($registration, $expectedLastRegistration);
		$this->logOutput();
	}
	
	public function testGetRegistrationWithInvalidRequest() {
		$this->setLBFake();
		$ZKH = new ZKHRegistration;
		$registration = $ZKH->setVGroupID(12305)->setCategoryID(120)->getRegistration();
		$this->assertEmpty($registration);
		$this->logOutput();
	}
	
	public function testInvalidRegistration() {
		$this->setLBFake();
		$model = new ZKHModel;
		$model->setAttributes(array(
			'registrationDate' => '2012-12-15 00:00:00',
			'registration' => '123',
			'vgid' => '1829',
			'catidx' => '1'
		));
		$valid = $model->validate();
		$this->assertFalse($valid);
		$this->logOutput();
	}
	
	public function testInvalidDateFormat() {
		$this->setLBFake();
		$model = new ZKHModel;
		$model->setAttributes(array(
			'registrationDate' => '2012-12-15',
			'registration' => '7000',
			'vgid' => '1829',
			'catidx' => '1'
		));
		$valid = $model->validate();
		$this->assertFalse($valid);
		$this->logOutput();
	}
	
	public function testDataToConfirm() {
		$this->setLBFake();
		$model = new ZKHModel;
		$model->setAttributes(array(
			'registrationDate' => '2012-12-15 00:00:00',
			'registration' => '7000',
			'vgid' => '1829',
			'catidx' => '1'
		));
		$valid = $model->validate();
		$this->assertTrue($valid);
		$dataToConfirm = $model->getDataToConfirm();
		$this->writeExpected('DataToConfirm', $dataToConfirm);
		$expectedDataToConfirm = $this->getExpected('DataToConfirm');
		$this->assertEquals($dataToConfirm, $expectedDataToConfirm);
		$this->logOutput();
	}
	
	public function testDataToConfirmWithNoLastRegistration() {
		$this->setLBFake();
		$model = new ZKHModel;
		$model->setAttributes(array(
			'registrationDate' => '2012-12-15 00:00:00',
			'registration' => '7000',
			'vgid' => '1829',
			'catidx' => '0'
		));
		$valid = $model->validate();
		$this->assertTrue($valid);
		$dataToConfirm = $model->getDataToConfirm();
		$expectedDataToConfirm = $this->getExpected('DataToConfirmWithNoLastRegistration');
		$this->assertEquals($dataToConfirm, $expectedDataToConfirm);
		$this->logOutput();
	}
	
	public function testSaveRegistration() {
		$this->setLBFake();
		$model = new ZKHModel;
		$model->setAttributes(array(
    		'registrationDate' => '2012-12-15 00:00:00',
    		'registration' => '7000',
    		'vgid' => '1829',
    		'catidx' => '1'
		));
		$valid = $model->validate();
		$this->assertTrue($valid);
		$saveData = $model->save();
		$expectedSaveData = $this->getExpected('SaveData');
		$this->assertEquals($saveData, $expectedSaveData);
		$this->logOutput();
	}
	
	public function testSaveRegistrationWithNoLastRegistration() {
		$this->setLBFake();
		$model = new ZKHModel;
		$model->setAttributes(array(
    		'registrationDate' => '2012-12-15 00:00:00',
    		'registration' => '7000',
    		'vgid' => '1829',
    		'catidx' => '0'
		));
		$valid = $model->validate();
		$this->assertTrue($valid);
		$saveData = $model->save();
		$expectedSaveData = $this->getExpected('SaveDataWithNoLastRegistration');
		$this->assertEquals($saveData, $expectedSaveData);
		$this->logOutput();
	}

} ?>