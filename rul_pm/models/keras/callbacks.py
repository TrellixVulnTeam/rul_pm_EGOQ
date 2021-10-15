import logging
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from temporis.iterators.iterators import WindowedDatasetIterator
from rul_pm.graphics.plots import plot_true_and_predicted

from tensorflow.keras.callbacks import Callback
from temporis.iterators.utils import true_values
import tensorflow as tf

logger = logging.getLogger(__name__)


class PredictionCallback(Callback):
    """Generate a plot after each epoch with the predictions

    Parameters
    ----------
    model : tf.keras.Model
        The model used predict
    output_path : Path
        Path of the output image
    dataset : [type]
        The dataset that want to be plotted
    """

    def __init__(self, model: tf.keras.Model, output_path: Path, dataset: tf.data.Dataset, units: str):

        super().__init__()
        self.output_path = output_path
        self.dataset = dataset
        self.pm_model = model
        self.units = units

    def on_epoch_end(self, epoch, logs={}):
        print('FOOFOOF')
        ds = self.dataset.batch(64)
        print('b')
        y_pred = self.pm_model.predict( ds)
        print('a')
        y_true = true_values(self.dataset)
        ax = plot_true_and_predicted(
            {"Model": [{"true": y_true, "predicted": y_pred}]},
            figsize=(17, 5),
            units=self.units
        )
        ax.legend()
        ax.figure.savefig(self.output_path, dpi=ax.figure.dpi)

        plt.close(ax.figure)


class TerminateOnNaN(Callback):
    """Callback that terminates training when a NaN loss is encountered."""

    def __init__(self, batcher):
        super().__init__()
        self.batcher = batcher

    def on_batch_end(self, batch, logs=None):
        logs = logs or {}
        loss = logs.get("loss")
        if loss is not None:
            if np.isnan(loss) or np.isinf(loss):
                logger.info(
                    "Batch %d: Invalid loss, terminating training" % (batch))
                self.model.stop_training = True
                self.batcher.stop = True
