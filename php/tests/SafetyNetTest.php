<?php

class SafetyNetTest extends \PHPUnit\Framework\TestCase {

    const OUTPUT_DIR = __DIR__ . "/out/";
    const FILE_PREFIX = 'test_';

    /**
     * @test
     */
    public function createSafetyNet() {
        $this->markTestSkipped();

        for ($seed = 0; $seed < 400; $seed++) {
            $output = $this->captureGameOutput($seed);

            $this->writeFile($output, self::FILE_PREFIX . "$seed.log");
        }
    }

    public function testSafetyNet() {
        for ($seed = 0; $seed < 400; $seed++) {
            $output = $this->captureGameOutput($seed);

            $expected_output = $this->readFile(self::FILE_PREFIX . "$seed.log");

            $this->assertEquals($expected_output, $output);
        }
    }

    private function captureGameOutput($seed) {
        srand($seed);
        ob_start();

        include __DIR__ . '/../src/GameRunner.php';

        return ob_get_clean();
    }

    private function writeFile($output, $filename) {
        if (!file_exists(self::OUTPUT_DIR)) {
            mkdir(self::OUTPUT_DIR);
        }
        $handle = fopen(self::OUTPUT_DIR . $filename,'w');
        fwrite($handle, $output);
        fclose($handle);
    }

    private function readFile($filename) {
        $file = self::OUTPUT_DIR . $filename;
        $handle = fopen($file,'r');
        $content = fread($handle,filesize($file));
        fclose($handle);
        return $content;
    }

}