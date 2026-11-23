package labor;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.beans.PropertyChangeEvent;
import java.beans.PropertyChangeListener;

import javax.swing.GroupLayout;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JProgressBar;
import javax.swing.JTextField;
import javax.swing.SwingConstants;
import javax.swing.SwingUtilities;
import javax.swing.WindowConstants;

import static javax.swing.GroupLayout.Alignment.BASELINE;
import static javax.swing.GroupLayout.Alignment.LEADING;

public class Labor implements Runnable, ActionListener, PropertyChangeListener {

    /* a két updater, ha éppen futnak */
    Updater u1;
    Updater u2;

    public Labor() {
        u1 = null;
        u2 = null;
    }

    /** a gomboktól jövő események kezelése */
    @Override
    public void actionPerformed(ActionEvent e) {
        if ("first".equals(e.getActionCommand())) {
            if (u1 != null && !u1.isDone()) {
                u1.cancel(true);
            }

            progress1.setValue(0);
            field1.setText("");
            u1 = new Updater();
            u1.addPropertyChangeListener(this);
            u1.execute();
        } else if ("second".equals(e.getActionCommand())) {
            if (u2 != null && !u2.isDone()) {
                u2.cancel(true);
            }

            progress2.setValue(0);
            field2.setText("");
            u2 = new Updater();
            u2.addPropertyChangeListener(this);
            u2.execute();
        }
    }

    /** az updater-ektől jövő események kezelése */
    @Override
    public void propertyChange(PropertyChangeEvent evt) {
        Updater updater = (Updater) evt.getSource();
        JProgressBar progressBar;
        JTextField field;

        if (updater == u1) {
            progressBar = progress1;
            field = field1;
        } else if (updater == u2) {
            progressBar = progress2;
            field = field2;
        } else {
            return;
        }

        if ("progress".equals(evt.getPropertyName())) {
            progressBar.setValue((Integer) evt.getNewValue());
        }

        if ("state".equals(evt.getPropertyName()) && updater.isDone()
                && !updater.isCancelled()) {
            try {
                field.setText(String.valueOf(updater.get()));
                progressBar.setValue(100);
            } catch (Exception ex) {
                field.setText("Hiba tortent.");
            }
        }
    }

    /* az eseménykezelés során elérendő elemek */
    JTextField field1;
    JProgressBar progress1;
    JTextField field2;
    JProgressBar progress2;

    /** a frame-et felépítő kód */
    @Override
    public void run() {
        JFrame f = new JFrame();
        GroupLayout layout = new GroupLayout(f.getContentPane());
        f.getContentPane().setLayout(layout);
        layout.setAutoCreateGaps(true);
        layout.setAutoCreateContainerGaps(true);

        JLabel label1 = new JLabel("First row");
        field1 = new JTextField(10);
        JButton button1 = new JButton("Start");
        button1.setActionCommand("first");
        button1.addActionListener(this);
        progress1 = new JProgressBar(0, 100);
        progress1.setStringPainted(true);

        JLabel label2 = new JLabel("Second row");
        field2 = new JTextField(10);
        JButton button2 = new JButton("Start");
        button2.setActionCommand("second");
        button2.addActionListener(this);
        progress2 = new JProgressBar(0, 100);
        progress2.setStringPainted(true);

        layout.setHorizontalGroup(layout.createSequentialGroup()
                .addGroup(layout.createParallelGroup(LEADING)
                        .addComponent(label1)
                        .addComponent(label2))
                .addGroup(layout.createParallelGroup(LEADING)
                        .addComponent(field1)
                        .addComponent(field2))
                .addGroup(layout.createParallelGroup(LEADING)
                        .addComponent(button1)
                        .addComponent(button2))
                .addGroup(layout.createParallelGroup(LEADING)
                        .addComponent(progress1)
                        .addComponent(progress2)));

        layout.setVerticalGroup(layout.createSequentialGroup()
                .addGroup(layout.createParallelGroup(BASELINE)
                        .addComponent(label1)
                        .addComponent(field1)
                        .addComponent(button1)
                        .addComponent(progress1))
                .addGroup(layout.createParallelGroup(BASELINE)
                        .addComponent(label2)
                        .addComponent(field2)
                        .addComponent(button2)
                        .addComponent(progress2)));

        layout.linkSize(SwingConstants.VERTICAL, field1, field2);

        f.pack();
        f.setDefaultCloseOperation(WindowConstants.EXIT_ON_CLOSE);
        f.setTitle("Swing Labor");
        f.setVisible(true);
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(new Labor());
    }
}
