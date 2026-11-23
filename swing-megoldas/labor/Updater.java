package labor;

import calc.Calculator;
import javax.swing.SwingWorker;

public class Updater extends SwingWorker<Double, Object> {

    @Override
    public Double doInBackground() throws Exception {
        Calculator calculator = new Calculator();
        int progress = 0;

        while (progress < 100) {
            if (isCancelled()) {
                return null;
            }

            progress = calculator.work();
            setProgress(progress);
        }

        return calculator.get();
    }
}
