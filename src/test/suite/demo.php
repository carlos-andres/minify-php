<?php

/**
 * LoremIpsumGenerator Class
 *
 * A simple class for generating dummy Lorem Ipsum text.
 */
class LoremIpsumGenerator
{
    /**
     * An array of predefined Lorem Ipsum sentences.
     *
     * @var array
     */
    private $sentences = [
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        'Quisque vitae erat est.',
        'Curabitur quis lacus a tortor tempor mattis.',
        'Praesent vulputate, nisi ac consequat dictum, nibh erat rhoncus quam, quis fermentum libero lorem vel lacus.',
        'Sed rutrum sapien id massa.',
        'Vivamus accumsan, est sed vehicula ullamcorper, magna justo faucibus velit, et cursus elit diam a lorem.',
        'Mauris non libero suscipit, ullamcorper diam at, cursus elit.',
        'Nunc at nibh nec leo tincidunt ornare.',
        'Suspendisse vitae est at leo luctus porta.',
        'Nulla facilisi.',
        'Proin vehicula pellentesque risus.'
    ];

    /**
     * Generate a number of random sentences from the predefined array.
     *
     * @param int $numberOfSentences The number of sentences to generate. Default is 6.
     * @return string Generated text consisting of the requested number of sentences.
     */
    public function generate($numberOfSentences = 6)
    {
        // Shuffle the predefined sentences to generate a random output.
        shuffle($this->sentences);

        // Combine the needed number of sentences into a single string.
        return implode(' ', array_slice($this->sentences, 0, $numberOfSentences));
    }

    /**
     * Generate two paragraphs of dummy text.
     *
     * This function uses the generate() method to create two paragraphs, 
     * each consisting of 6 sentences by default.
     *
     * @return string Generated text in the form of two paragraphs.
     */
    public function generateTwoParagraphs()
    {
        return $this->generate(6) . "\n\n" . $this->generate(6);
    }
}

// Usage example
$generator = new LoremIpsumGenerator();

// Print result 2 Paragraphs
echo $generator->generateTwoParagraphs();

?>
