<?php 
//Model
class CurrencyConverter {
	private $baseValue = 0;
	
	private $rates = [
		'GBP' => 1.0,
		'USD' => 0.6,
		'EUR' => 0.83,
		'YEN' => 0.0058		
	];
	
	public function get($currency) {
		if (isset($this->rates[$currency])) {
			$rate = 1/$this->rates[$currency];
			return round($this->baseValue * $rate, 2);
		}
		else return 0;		
	}
	
	public function set($amount, $currency = 'GBP') {
		if (isset($this->rates[$currency])) {
			$this->baseValue = $amount * $this->rates[$currency];
		}
	}
	
}



//View 
class CurrencyConverterView {
	private $converter;
	private $currency;
	
	public function __construct(CurrencyConverter $converter, $currency) {
		$this->converter = $converter;
		$this->currency = $currency;
	}
	
	public function output() {
		$html = '<form action="?action=convert" method="post">
					<input name="currency" type="hidden" value="' . $this->currency .'" />
					<label>' . $this->currency .':</label>
					<input name="amount" type="text" value="' . $this->converter->get($this->currency) . '" />
					<input type="submit" value="Convert" />				
				</form>';
		
		return $html;
	}
}


//Controller
class CurrencyConverterController {
	private $model;
	
	public function __construct($model) {
		$this->model = $model;
	}
	
	public function convert($request) {
		if (isset($request['currency']) && isset($request['amount'])) {
			$this->model->set($request['amount'], $request['currency']);
		}
	}
}


//Application initialisation/entry point. 
$model = new CurrencyConverter();
$controller = new CurrencyConverterController($model);

//If one of the forms has been submitted, call the relevant controller action
if (isset($_GET['action'])) $controller->{$_GET['action']}($_POST);

$gbpView = new CurrencyConverterView($model, 'GBP');
echo $gbpView->output();

$usdView = new CurrencyConverterView($model, 'USD');
echo $usdView->output();

$eurView = new CurrencyConverterView($model, 'EUR');
echo $eurView->output();

$yenView = new CurrencyConverterView($model, 'YEN');
echo $yenView->output();

