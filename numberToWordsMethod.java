import java.text.DecimalFormat;

public class numberToWordsMethod {

	public static void main(String[] args) {

		// System.out.println(reverse(1450));
		// System.out.println(reverse(-121));
		// System.out.println(reverse(1010));
		// System.out.println(reverse(1000));

		numberToWords(-10);
		numberToWords(1000);
		// numberToWords(123);
		// System.out.println(getDigitCount(10000));

	}
	// This WORKS prints numbers as ints to text

	public static void numberToWords(int number) {
		if (number < 0) {
			System.out.println("Invalid Value");
		}

		int lastDigit = 0;
		int numOfDigits = getDigitCount(number);
		number = reverse(number); // reverse the number so we can print it backwards
		int leftOverDigits = getDigitCount(number);
		numOfDigits = numOfDigits - leftOverDigits; // finding out how many zeros are at the beginning of the number

		if (number == 0) {
			System.out.println("Zero");
		}

		while (number > 0) {
			lastDigit = number % 10;
			number /= 10;
			switch (lastDigit) {

			case 1:
				System.out.print("One ");
				break;

			case 2:
				System.out.print("Two ");
				break;

			case 3:
				System.out.print("Three ");
				break;

			case 4:
				System.out.print("Four ");
				break;

			case 5:
				System.out.print("Five ");
				break;

			case 6:
				System.out.print("Six ");
				break;

			case 7:
				System.out.print("Seven ");
				break;

			case 8:
				System.out.print("Eight ");
				break;

			case 9:
				System.out.print("Nine ");
				break;

			default:
				System.out.print("Zero ");
				break;
			}
		}

		for (int i = 0; i < numOfDigits; i++) { // prints our zeros at the beginning of text
			System.out.print("Zero ");
		}
	}

	// this method is used to reverse the number given

	public static int reverse(int number) {
		int lastDigit = 0;
		int reversed = 0;

		if (number >= 0) {

			while (number > 0) {
				lastDigit = number % 10;
				number /= 10;
				reversed = reversed * 10 + lastDigit;
			}

			return reversed;
		}

		if (number < 0) {
			number *= -1;
			while (number > 0) {
				lastDigit = number % 10;
				number /= 10;
				reversed = reversed * 10 + lastDigit;
			}
			return reversed * -1;
		}

		return -1;
	}

	// gets count for number of digits in an integer

	public static int getDigitCount(int number) {

		int count = 0;

		if (number == 0) {
			return 1;
		}

		if (number > 0) {

			while (number > 0) {

				number /= 10;
				count++;
			}
			return count;
		}

		return -1;
	}
}
