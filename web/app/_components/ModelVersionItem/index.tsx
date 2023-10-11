import React, { useMemo } from "react";
import { formatDownloadPercentage, toGigabytes } from "@/_utils/converter";
import Image from "next/image";
import { Product } from "@/_models/Product";
import useDownloadModel from "@/_hooks/useDownloadModel";
import { modelDownloadStateAtom } from "@/_helpers/atoms/DownloadState.atom";
import { atom, useAtomValue } from "jotai";
import { ModelVersion } from "@/_models/ModelVersion";
import { useGetDownloadedModels } from "@/_hooks/useGetDownloadedModels";
import SimpleTag from "../SimpleTag";
import { ModelPerformance } from "../SimpleTag/TagType";

type Props = {
  model: Product;
  modelVersion: ModelVersion;
  isRecommended: boolean;
};

const ModelVersionItem: React.FC<Props> = ({
  model,
  modelVersion,
  isRecommended,
}) => {
  const { downloadModel } = useDownloadModel();
  const { downloadedModels } = useGetDownloadedModels();
  const isDownloaded =
    downloadedModels.find((model) => model.id === modelVersion.id) != null;

  const downloadAtom = useMemo(
    () => atom((get) => get(modelDownloadStateAtom)[modelVersion.id ?? ""]),
    [modelVersion.id ?? ""]
  );
  const downloadState = useAtomValue(downloadAtom);

  const onDownloadClick = () => {
    downloadModel(model, modelVersion);
  };

  let downloadButton = (
    <button
      className="text-indigo-600 text-sm font-medium"
      onClick={onDownloadClick}
    >
      Download
    </button>
  );

  if (downloadState) {
    downloadButton = (
      <div>{formatDownloadPercentage(downloadState.percent)}</div>
    );
  } else if (isDownloaded) {
    downloadButton = <div>Downloaded</div>;
  }

  return (
    <div className="flex justify-between items-center gap-4 pl-3 pt-3 pr-4 pb-3 border-t border-gray-200 first:border-t-0">
      <div className="flex items-center gap-4">
        <Image src={"/icons/app_icon.svg"} width={14} height={20} alt="" />
        <span className="font-sm text-gray-900">{modelVersion.name}</span>
      </div>
      <div className="flex items-center gap-4">
        {isRecommended && (
          <SimpleTag
            title={"Recommended"}
            type={ModelPerformance.PerformancePositive}
            clickable={false}
          />
        )}
        <div className="px-2.5 py-0.5 bg-gray-200 text-xs font-medium rounded">
          {toGigabytes(modelVersion.size)}
        </div>
        {downloadButton}
      </div>
    </div>
  );
};

export default ModelVersionItem;
