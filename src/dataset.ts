/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DatasetRow, SupplierMetrics } from './types';

// Raw CSV string of the dataset provided in user prompt
export const rawCSV = `haircare;SKU0;6.980.800.554.211.570;55;802;8.661.996.792.392.380;Non-binary;58;7;96;4;Carrier B;2.956.572.139.430.800;Supplier 3;Mumbai;29;215;29;4.627.987.924.050.830;Pending;0.22641036084992516;Road;Route B;18.775.207.545.920.300
skincare;SKU1;14.843.523.275.084.300;95;736;7.460.900.065.445.840;Female;53;30;37;2;Carrier A;971.657.477.143.131;Supplier 3;Mumbai;23;517;30;3.361.676.895.373;Pending;4.854.068.026.388.700;Road;Route B;5.030.655.791.496.690
haircare;SKU2;11.319.683.293.090.500;34;8;957.774.962.586.873;Unknown;1;10;88;2;Carrier B;8.054.479.261.732.150;Supplier 1;Mumbai;12;971;27;30.688.019.348.284.200;Pending;4.580.592.619.199.220;Air;Route C;14.192.028.177.151.900
skincare;SKU3;61.163.343.016.437.700;68;83;7.766.836.425.685.230;Non-binary;23;13;59;6;Carrier C;17.295.685.635.434.200;Supplier 5;Kolkata;24;937;18;3.562.474.139.712.500;Fail;474.664.862.064.775;Rail;Route A;25.477.615.921.928.600
skincare;SKU4;4.805.496.036.345.890;26;871;2.686.505.151.567.440;Non-binary;5;3;56;8;Carrier A;38.905.479.158.706.700;Supplier 1;Delhi;5;414;3;9.206.516.059.871.280;Fail;3.145.579.522.833.000;Air;Route A;9.234.406.317.119.220
haircare;SKU5;16.999.760.138.659.300;87;147;2.828.348.745.975.750;Non-binary;90;27;66;3;Carrier B;4.444.098.864.382.290;Supplier 4;Bangalore;10;104;17;567.664.755.574.318;Fail;27.791.935.115.711.600;Road;Route A;2.354.612.367.355.370
skincare;SKU6;4.078.332.863.107.940;48;65;7.823.476.559.531.730;Male;11;15;58;8;Carrier C;38.807.633.029.520.000;Supplier 3;Kolkata;14;314;24;10.850.685.695.870.600;Pending;10.009.106.193.041.300;Sea;Route A;13.436.909.686.103.100
cosmetics;SKU7;4.295.838.438.246.000;59;426;8.496.103.813.089.830;Female;93;17;11;1;Carrier B;23.483.387.844.177.800;Supplier 4;Bangalore;22;564;1;9.946.610.860.359.910;Fail;0.3981771868506506;Road;Route C;8.020.563.118.175.580
cosmetics;SKU8;6.871.759.674.852.730;78;150;7.517.363.210.631.120;Female;5;10;15;7;Carrier C;34.047.338.570.830.200;Supplier 4;Mumbai;13;769;8;11.423.027.139.565.600;Pending;27.098.626.911.099.600;Sea;Route B;50.555.713.422.546.400
skincare;SKU9;6.401.573.294.127.850;35;980;4.971.145.987.585.550;Unknown;14;27;83;1;Carrier A;7.166.645.291.048.210;Supplier 2;Chennai;29;963;23;4.795.760.163.495.150;Pending;3.844.614.478.767.580;Rail;Route B;9.959.294.614.986.410
skincare;SKU10;15.707.795.681.912.100;11;996;2.330.965.802.091.940;Non-binary;51;13;80;2;Carrier C;8.673.211.211.278.610;Supplier 5;Kolkata;18;830;5;9.652.735.278.531.090;Pass;17.273.139.283.559.400;Road;Route B;806.103.177.702.923
skincare;SKU11;9.063.545.998.228.860;95;960;6.099.944.115.581.450;Female;46;23;60;1;Carrier A;4.523.943.124.316.660;Supplier 2;Kolkata;28;362;11;27.592.363.086.663.600;Pending;0.02116982137299439;Air;Route A;12.672.303.340.940.700
haircare;SKU12;7.121.338.907.536.000;41;336;28.737.414.460.214.400;Unknown;100;30;85;4;Carrier A;1.325.274.010.184.520;Supplier 4;Kolkata;3;563;3;3.232.128.621.342.400;Fail;21.612.537.475.559.100;Road;Route B;4.029.687.890.737.700
skincare;SKU13;16.160.393.317.379.900;5;249;40.527.384.162.378.600;Male;80;8;48;9;Carrier A;9.537.283.061.108.330;Supplier 5;Bangalore;23;173;10;9.782.905.011.017.320;Pending;16.310.742.300.715.300;Road;Route B;5.472.410.051.609.680
skincare;SKU14;9.917.132.863.862.410;26;562;8.653.570.926.469.800;Non-binary;54;29;78;5;Carrier B;20.397.701.894.493.300;Supplier 1;Kolkata;25;558;14;5.791.436.629.862.980;Pending;0.10068285156509371;Air;Route B;9.292.352.899.608.890
skincare;SKU15;3.698.924.492.862.690;94;469;5.442.086.785.397.670;Non-binary;9;8;69;7;Carrier B;24.220.397.232.752.000;Supplier 1;Bangalore;14;580;7;9.712.128.175.147.430;Pass;2.264.405.761.198.540;Sea;Route B;12.786.180.000.162.500
skincare;SKU16;7.547.172.109.791.270;74;280;6.453.797.968.176.280;Female;2;5;78;1;Carrier B;4.191.324.585.705.500;Supplier 1;Bangalore;3;399;21;7.710.634.249.785.000;Pass;1.012.563.089.258.040;Air;Route A;8.655.257.797.712.400
cosmetics;SKU17;8.146.253.436.923.700;82;126;2.629.396.434.845.260;Female;45;17;85;9;Carrier C;3.585.418.958.232.340;Supplier 1;Chennai;7;453;16;47.679.680.368.355.300;Fail;0.10202075491817619;Air;Route C;6.709.343.907.924.100
haircare;SKU18;36.443.627.770.460.900;23;620;9.364.673.505.076.170;Unknown;10;10;46;8;Carrier C;4.339.224.714.110.700;Supplier 2;Kolkata;18;374;17;2.710.798.085.484.390;Pending;22.319.391.107.292.600;Sea;Route A;5.934.802.587.206.510
skincare;SKU19;5.112.387.008.796.470;100;187;2.553.495.584.991.210;Unknown;48;11;94;3;Carrier A;4.742.635.882.841.870;Supplier 4;Chennai;20;694;16;8.237.332.058.799.020;Fail;36.464.508.654.170.200;Road;Route C;47.730.763.109.090.300
skincare;SKU20;9.634.107.243.996.330;22;320;8.128.027.696.851.190;Unknown;27;12;68;6;Carrier A;887.833.465.092.684;Supplier 1;Chennai;29;309;6;6.568.625.960.848.860;Pass;4.231.416.573.534.530;Air;Route B;49.387.121.531.620.500
cosmetics;SKU21;8.489.386.898.495.080;60;601;7.087.052.696.357.430;Unknown;69;25;7;6;Carrier B;6.037.883.769.218.290;Supplier 5;Chennai;19;791;4;6.173.572.895.416.090;Pending;0.0186075676310149;Air;Route C;523.360.914.720.158
haircare;SKU22;2.767.978.088.650.190;55;884;23.908.078.665.561.700;Unknown;71;1;63;10;Carrier A;956.764.892.092.304;Supplier 4;Kolkata;22;780;28;5.012.083.961.297.730;Fail;2.591.275.473.211.110;Rail;Route C;20.557.199.582.694.700
cosmetics;SKU23;4.324.341.185.864.160;30;391;8.858.367.571.011.480;Unknown;84;5;29;7;Carrier A;2.924.857.601.145.550;Supplier 5;Kolkata;11;568;29;9.860.995.724.270.380;Pending;13.422.915.627.227.300;Rail;Route A;19.632.944.611.241.200
haircare;SKU24;4.156.308.359.311.100;32;209;9.049.077.860.939.890;Male;4;26;2;8;Carrier C;9.741.291.689.284.360;Supplier 2;Bangalore;28;447;3;40.382.359.702.924.800;Pending;3.691.310.292.628.720;Air;Route A;7.587.247.726.029.380
haircare;SKU25;39.629.343.985.092.600;73;142;2.174.777.054.350.650;Male;82;11;52;3;Carrier C;2.231.073.681.281.720;Supplier 4;Kolkata;19;934;23;7.828.038.311.841.530;Pending;3.797.231.217.114.180;Road;Route B;45.853.594.573.920.900
haircare;SKU26;9.744.694.661.789.280;9;353;3.716.493.325.894.030;Male;59;16;48;4;Carrier B;6.507.548.621.078.550;Supplier 2;Bangalore;26;171;4;15.972.229.757.181.700;Pass;2.119.319.736.724.920;Rail;Route A;6.178.669.164.583.770
cosmetics;SKU27;9.255.736.081.240.200;42;352;26.864.572.235.759.800;Unknown;47;9;62;8;Carrier C;7.406.750.952.998.070;Supplier 5;Mumbai;25;291;4;10.528.245.070.042.100;Fail;2.864.667.837.883.370;Sea;Route B;7.624.591.821.556.830
cosmetics;SKU28;2.397.274.705.597.140;12;394;6.117.324.615.083.990;Female;48;15;24;4;Carrier B;9.898.140.508.069.220;Supplier 1;Mumbai;13;171;7;5.942.938.181.069.150;Fail;0.815757079295672;Air;Route A;12.343.702.751.182.700
cosmetics;SKU29;6.344.755.918.520.730;3;253;8.318.903.194.617.170;Female;45;5;67;7;Carrier B;8.100.973.145.397.030;Supplier 1;Kolkata;16;329;7;3.929.287.558.606.570;Pass;3.878.098.936.588.480;Road;Route B;7.649.353.759.407.080
haircare;SKU30;8.022.859.210.526.390;10;327;2.766.342.366.866.080;Male;60;26;35;7;Carrier B;8.954.528.315.318.010;Supplier 4;Kolkata;27;806;30;51.634.893.400.109.300;Pending;0.9653947053523931;Road;Route C;880.080.988.247.161
skincare;SKU31;508.473.930.517.187;28;168;9.655.135.102.719.390;Male;6;17;44;4;Carrier B;26.796.609.649.814.000;Supplier 3;Chennai;24;461;8;6.025.114.566.159.800;Pending;29.890.000.066.550.700;Rail;Route C;6.093.792.066.184.260
skincare;SKU32;7.920.993.601.565.670;43;781;9.571.550.487.327.810;Unknown;89;13;64;4;Carrier C;6.599.104.901.238.580;Supplier 3;Kolkata;30;737;7;29.692.467.153.749.700;Pass;1.946.036.119.386.110;Road;Route A;7.611.739.095.148.770
cosmetics;SKU33;647.954.350.001.556;63;616;51.499.983.504.080.300;Non-binary;4;17;95;9;Carrier C;485.827.050.343.664;Supplier 5;Chennai;1;251;23;23.853.427.512.896.100;Fail;3.541.046.012.250.920;Sea;Route A;371.255.295.519.871
skincare;SKU34;3.746.759.232.984.240;96;602;9.061.710.895.507.720;Unknown;1;26;21;7;Carrier A;1.019.487.570.822.110;Supplier 1;Chennai;4;452;10;10.754.272.815.029.300;Pass;0.6466045593720549;Road;Route B;5.103.580.004.335.230
cosmetics;SKU35;8.495.778.681.635.040;11;449;6.541.329.344.802.460;Female;42;27;85;8;Carrier C;5.288.189.990.327.400;Supplier 1;Delhi;3;367;2;58.004.787.044.743.700;Pass;0.5411540980605811;Sea;Route C;5.534.204.712.303.550
skincare;SKU36;9.813.002.578.754.050;34;963;7.573.402.457.848.730;Female;18;23;28;3;Carrier B;2.107.951.267.159.080;Supplier 2;Delhi;26;671;19;45.531.364.237.162.100;Fail;38.055.333.792.433.500;Air;Route C;4.038.089.742.481.800
skincare;SKU37;2.339.984.475.261.430;5;963;2.438.339.930.470.020;Female;25;8;21;9;Carrier A;15.326.552.735.904.300;Supplier 3;Kolkata;24;867;15;3.434.327.746.507.530;Pending;2.610.288.084.848.110;Sea;Route A;18.393.296.804.359.400
cosmetics;SKU38;520.759.306.827.078;75;705;9.692.318.040.218.430;Non-binary;69;1;88;5;Carrier B;9.235.931.437.249.220;Supplier 5;Mumbai;10;841;12;5.930.693.645.528.310;Pending;0.6133268991645074;Air;Route B;33.967.286.994.860.600
skincare;SKU39;19.127.477.265.823.200;26;176;19.124.656.631.007.600;Female;78;29;34;3;Carrier A;5.562.503.778.830.380;Supplier 2;Kolkata;30;791;6;9.005.807.428.781.640;Fail;1.451.972.203.996.810;Air;Route B;6.536.729.945.520.330
skincare;SKU40;8.054.142.417.094.030;97;933;5.724.959.350.456.260;Female;90;20;39;8;Carrier C;7.229.595.139.736.470;Supplier 1;Kolkata;18;793;1;8.817.940.710.421.740;Pending;4.213.269.430.586.560;Road;Route A;5.298.087.239.806.910
skincare;SKU41;9.911.329.161.531.710;35;556;55.212.052.590.109.700;Female;64;19;38;8;Carrier B;5.773.263.743.766.650;Supplier 4;Chennai;18;892;7;953.320.645.487.725;Fail;0.04530226239825963;Sea;Route A;2.755.243.711.313.090
skincare;SKU42;4.652.916.761.451.670;98;155;1.839.609.425.856.760;Female;22;27;57;4;Carrier C;7.526.248.326.851.500;Supplier 5;Bangalore;26;179;7;9.642.282.063.957.180;Fail;4.939.255.288.620.940;Road;Route A;6.356.571.205.019.910
haircare;SKU43;1.174.327.177.630.920;6;598;5.737.425.599.119.020;Unknown;36;29;85;9;Carrier B;36.940.212.683.884.500;Supplier 5;Mumbai;1;206;23;2.627.736.595.733.240;Pending;0.3723047679850977;Air;Route A;7.160.441.197.593.400
cosmetics;SKU44;5.135.579.091.311.030;34;919;71.522.860.494.355.100;Female;13;19;72;6;Carrier C;7.577.449.657.376.690;Supplier 2;Delhi;7;834;18;22.554.106.620.887.700;Fail;2.962.626.320.454.880;Rail;Route A;6.104.532.696.192.270
haircare;SKU45;3.378.413.803.306.550;1;24;5.267.956.807.510.520;Male;93;7;52;6;Carrier B;521.515.500.871.191;Supplier 2;Chennai;25;794;25;6.631.254.443.999.160;Pass;3.219.604.612.084.100;Rail;Route A;49.530.569.702.847.300
haircare;SKU46;270.822.071.998.889;75;859;25.567.673.606.335.900;Non-binary;92;29;6;8;Carrier B;4.070.955.837.084.080;Supplier 3;Chennai;18;870;23;7.732.235.321.105.160;Pending;36.486.105.925.362.000;Road;Route B;3.804.359.371.119.640
skincare;SKU47;9.571.213.588.093.600;93;910;7.089.474.249.934.180;Male;4;15;51;9;Carrier B;897.875.075.594.997;Supplier 1;Kolkata;10;964;20;19.712.992.911.293.600;Pending;0.38057358671321373;Rail;Route A;5.816.023.550.505.860
haircare;SKU48;7.603.554.442.689.170;28;29;739.707.100.458.718;Non-binary;30;16;9;3;Carrier C;70.958.331.565.551.300;Supplier 2;Mumbai;9;109;18;23.126.363.582.464.700;Fail;16.981.125.407.144.000;Rail;Route B;76.865.191.395.437
cosmetics;SKU49;7.889.791.320.564.000;19;99;8.001.613.206.519.000;Unknown;97;24;9;6;Carrier C;25.056.210.329.009.100;Supplier 5;Delhi;28;177;28;14.147.815.443.979.200;Pass;2.825.813.985.400.130;Rail;Route A;3.368.901.685.199.770
cosmetics;SKU50;14.203.484.264.803.000;91;633;5.910.885.389.668.890;Female;31;23;82;10;Carrier A;6.247.860.914.975.990;Supplier 2;Delhi;20;306;21;4.517.875.792.463.450;Fail;4.754.800.804.671.180;Rail;Route B;49.624.865.029.194.000
haircare;SKU51;2.670.076.097.246.170;61;154;9.866.465.457.979.690;Male;100;4;52;1;Carrier A;4.783.000.557.947.660;Supplier 5;Bangalore;18;673;28;1.419.032.834.456.990;Pending;17.729.511.720.835.500;Road;Route A;6.949.823.175.794.450
skincare;SKU52;9.803.182.965.646.500;1;820;943.576.260.891.213;Male;64;11;11;1;Carrier B;8.631.052.179.768.940;Supplier 1;Mumbai;10;727;27;9.166.849.148.597.150;Pending;21.224.716.191.438.200;Air;Route C;6.028.984.988.383.830
skincare;SKU53;30.341.470.711.214.200;93;242;8.232.334.829.425.820;Male;96;25;54;3;Carrier B;10.134.865.660.958.900;Supplier 1;Delhi;1;631;17;8.334.405.899.167.790;Pending;14.103.475.760.760.200;Air;Route B;7.507.378.406.682.700
haircare;SKU54;31.146.243.160.240.800;11;622;6.088.021.479.940.850;Non-binary;33;22;61;3;Carrier B;43.051.034.712.876.300;Supplier 1;Kolkata;26;497;29;30.186.023.375.822.500;Pass;24.787.719.755.397.400;Road;Route B;8.140.699.965.821.870
haircare;SKU55;7.985.505.834.078.940;16;701;29.256.751.703.038.100;Male;97;11;11;5;Carrier A;5.014.364.955.030.900;Supplier 2;Delhi;27;918;5;303.235.452.566.165;Fail;4.548.919.659.396.380;Sea;Route B;32.301.292.795.247.800
skincare;SKU56;20.986.386.037.043.300;90;93;4.767.020.484.344.130;Non-binary;25;23;83;5;Carrier C;17.744.297.140.717.300;Supplier 1;Mumbai;24;826;28;12.836.284.572.832.700;Pass;1.173.755.495.387.450;Air;Route B;8.322.108.087.060.210
haircare;SKU57;49.263.205.350.734.100;65;227;16.058.669.003.924.000;Unknown;5;18;51;1;Carrier B;916.055.853.538.187;Supplier 2;Delhi;21;588;25;6.777.962.298.707.810;Pending;2.511.174.830.212.700;Rail;Route A;48.219.123.860.252.800
skincare;SKU58;5.984.156.137.728.930;81;896;20.211.498.103.371.000;Non-binary;10;5;44;7;Carrier A;493.843.856.471.209;Supplier 3;Delhi;18;396;7;6.504.741.509.469.140;Fail;17.303.747.198.591.900;Road;Route B;11.036.433.523.136.400
cosmetics;SKU59;63.828.398.347.710.900;30;484;1.061.618.523.013.280;Non-binary;100;16;26;7;Carrier B;7.293.722.596.867.720;Supplier 1;Kolkata;11;176;4;1.900.762.243.519.450;Fail;0.4471940154638232;Air;Route A;3.125.742.736.100.930
skincare;SKU60;17.028.027.920.188.700;16;380;8.864.084.349.586.430;Female;41;27;72;8;Carrier C;43.813.681.581.023.100;Supplier 4;Mumbai;29;929;24;8.721.305.781.513.560;Fail;2.853.090.616.649.050;Rail;Route A;43.016.909.697.513.600
haircare;SKU61;5.202.874.990.329.490;23;117;6.885.589.350.896.250;Unknown;32;23;36;7;Carrier C;9.030.340.422.521.940;Supplier 4;Kolkata;14;480;12;787.023.939.688.789;Fail;4.367.470.538.205.050;Air;Route A;16.436.652.824.341.900
cosmetics;SKU62;7.279.635.395.558.730;89;270;38.997.468.337.292.200;Unknown;86;2;40;7;Carrier C;7.291.701.388.776.770;Supplier 2;Mumbai;13;751;14;21.048.642.725.168.600;Pass;18.740.014.040.443.700;Sea;Route C;3.208.465.157.591.110
skincare;SKU63;13.017.376.785.287.800;55;246;4.256.949.140.850.220;Non-binary;54;19;10;4;Carrier A;245.793.352.798.733;Supplier 3;Bangalore;18;736;10;20.075.003.975.630.400;Pending;36.328.432.903.821.300;Sea;Route A;6.872.861.778.664.170
skincare;SKU64;8.963.409.560.813.530;11;134;8.458.730.878.367.170;Female;73;27;75;6;Carrier C;4.585.353.468.194.650;Supplier 1;Delhi;17;328;6;8.693.042.425.877.280;Fail;0.15948631471751462;Air;Route C;7.712.250.846.811.570
skincare;SKU65;3.369.771.720.664.310;72;457;8.354.579.686.481.990;Male;57;24;54;8;Carrier C;6.580.541.347.884.590;Supplier 5;Kolkata;16;358;21;15.972.227.430.506.700;Fail;4.911.095.954.842.330;Rail;Route C;5.558.591.036.717.430
skincare;SKU66;26.034.869.773.962.000;52;704;8.367.721.618.020.150;Female;13;17;19;8;Carrier A;22.161.427.287.713.600;Supplier 5;Kolkata;24;867;28;4.208.443.673.830.990;Fail;34.480.632.883.402.600;Road;Route A;3.938.433.485.784.270
skincare;SKU67;8.775.543.235.400.100;16;513;9.473.798.032.508.330;Unknown;12;9;71;9;Carrier C;9.147.811.544.710.630;Supplier 1;Mumbai;10;198;11;7.057.876.146.978.230;Pass;0.13195544431181483;Sea;Route C;1.692.718.013.847.860
haircare;SKU68;3.793.181.238.279.030;29;163;3.550.218.432.780.990;Non-binary;0;8;58;8;Carrier B;11.942.518.648.849.900;Supplier 2;Bangalore;2;375;18;971.135.815.634.622;Fail;198.346.787.217.418;Rail;Route A;29.970.630.311.810.300
skincare;SKU69;5.486.552.851.706.970;62;511;17.523.810.874.841.200;Non-binary;95;1;27;3;Carrier B;9.705.286.790.120.340;Supplier 4;Kolkata;9;862;7;7.762.776.581.274.810;Pending;13.623.879.886.491.000;Air;Route A;20.766.320.620.857.500
haircare;SKU70;47.914.541.824.058.700;90;32;7.014.887.987.203.380;Female;10;12;22;4;Carrier B;6.315.717.754.600.720;Supplier 1;Bangalore;22;775;16;11.440.781.823.761.200;Pass;18.305.755.986.122.300;Road;Route C;18.327.289.874.871.100
cosmetics;SKU71;6.381.533.162.747.960;14;637;8.180.337.085.425.440;Female;76;2;26;6;Carrier A;9.228.190.317.052.510;Supplier 2;Bangalore;2;258;10;30.661.677.477.859.500;Pending;2.078.750.607.874.960;Road;Route A;40.516.706.788.885.500
cosmetics;SKU72;9.020.442.752.052.800;88;478;26.331.219.813.122.500;Non-binary;57;29;77;9;Carrier A;6.599.614.159.689.540;Supplier 1;Bangalore;21;152;11;5.576.049.289.524.420;Pending;3.213.329.607.438.300;Rail;Route B;6.779.445.698.461.830
cosmetics;SKU73;838.510.176.813.046;41;375;7.910.886.916.140.680;Male;17;25;66;5;Carrier B;15.129.368.369.160.700;Supplier 4;Chennai;13;444;4;46.870.238.797.617.100;Fail;4.620.546.064.513.700;Road;Route A;8.664.728.001.296.570
haircare;SKU74;3.170.011.413.566.150;64;904;5.709.945.295.969.280;Female;41;6;1;5;Carrier A;5.237.654.650.037.440;Supplier 4;Delhi;1;919;9;8.058.085.215.644.780;Fail;0.3966127241099354;Rail;Route A;34.155.265.678.322.300
skincare;SKU75;9.299.688.423.397.060;29;106;1.889.073.589.779.330;Non-binary;16;20;56;10;Carrier C;2.473.897.761.045.460;Supplier 1;Chennai;25;759;11;4.806.478.264.000.650;Pass;20.300.690.886.687.500;Air;Route C;8.731.296.480.176.510
haircare;SKU76;6.910.879.954.743.030;23;241;5.328.375.984.297.750;Male;38;1;22;10;Carrier A;7.054.538.336.836.920;Supplier 2;Bangalore;25;985;24;6.432.359.779.560.020;Pending;21.800.374.515.822.100;Rail;Route A;9.974.134.501.331.940
haircare;SKU77;5.744.974.295.897.140;14;359;24.837.601.775.427.900;Unknown;96;28;57;4;Carrier B;6.780.946.625.617.890;Supplier 1;Kolkata;26;334;5;4.295.244.474.899.180;Pass;3.055.141.818.307.540;Road;Route B;85.256.809.891.985
haircare;SKU78;6.306.883.176.111.910;50;946;12.924.584.179.377.500;Unknown;5;4;51;5;Carrier B;846.704.977.086.199;Supplier 5;Mumbai;25;858;21;7.112.651.472.040.330;Pending;4.096.881.332.470.450;Sea;Route C;32.359.220.343.132.200
haircare;SKU79;5.705.703.122.110.320;56;198;7.888.723.268.427.080;Non-binary;31;25;20;1;Carrier B;64.963.253.642.950.400;Supplier 3;Bangalore;5;228;12;5.787.090.292.403.620;Pending;0.16587162748060824;Air;Route C;35.150.421.933.503.800
skincare;SKU80;9.112.831.835.044.430;75;872;8.651.672.682.982.060;Unknown;39;14;41;2;Carrier C;28.331.846.794.189.700;Supplier 3;Chennai;8;202;5;7.696.122.802.382.000;Fail;28.496.621.985.053.300;Sea;Route B;7.877.798.504.943.440
haircare;SKU81;7.281.920.693.031.820;9;774;43.844.134.000.458.600;Unknown;48;6;8;5;Carrier B;4.066.277.501.512.040;Supplier 3;Delhi;28;698;1;19.789.592.941.903.600;Pending;25.475.471.215.487.100;Rail;Route B;27.677.833.594.679.800
skincare;SKU82;17.034.930.739.467.900;13;336;29.433.818.676.094.500;Unknown;42;19;72;1;Carrier A;470.818.187.354.193;Supplier 2;Mumbai;6;955;26;446.527.843.494.324;Pending;4.137.877.048.622.350;Road;Route C;5.899.785.556.280.400
haircare;SKU83;6.891.124.621.160.630;82;663;2.411.754.632.110.490;Unknown;65;24;7;8;Carrier B;4.949.839.577.996.940;Supplier 1;Bangalore;20;443;5;9.773.059.380.053.300;Fail;0.7730061340672478;Road;Route A;6.829.710.182.260.930
haircare;SKU84;8.910.436.729.210.220;99;618;20.482.900.998.487.100;Unknown;73;26;80;10;Carrier A;8.381.615.624.922.630;Supplier 5;Chennai;24;589;22;33.808.636.513.209.000;Pass;4.843.456.577.118.040;Air;Route B;46.545.700.596.368.700
cosmetics;SKU85;7.696.299.441.519.380;83;25;8.684.613.059.253.850;Female;15;18;66;2;Carrier C;8.249.168.704.871.720;Supplier 5;Chennai;4;211;2;699.293.455.186.723;Fail;13.744.289.997.457.500;Road;Route B;8.426.868.300.046.410
skincare;SKU86;1.999.817.694.040.420;18;223;12.295.910.285.649.800;Unknown;32;14;22;6;Carrier B;14.543.053.101.535.500;Supplier 1;Mumbai;4;569;18;7.460.896.999.519.460;Pass;20.515.129.307.662.400;Rail;Route A;2.642.548.898.358.660
haircare;SKU87;8.041.403.665.035.570;24;79;5.133.846.701.086.690;Male;5;7;55;10;Carrier A;6.575.803.797.548.530;Supplier 3;Chennai;27;523;17;2.869.699.682.414.310;Fail;36.937.377.878.392.700;Sea;Route B;8.793.592.177.349.240
cosmetics;SKU88;7.527.040.697.572.500;58;737;944.474.203.306.298;Male;60;18;85;7;Carrier A;38.012.531.329.310.700;Supplier 2;Mumbai;21;953;11;6.818.491.905.704.110;Pending;0.722204401882931;Sea;Route A;10.391.624.796.070.400
cosmetics;SKU89;9.776.008.558.193.860;10;134;5.924.682.566.853.230;Unknown;90;1;27;8;Carrier B;9.929.816.245.277.250;Supplier 1;Kolkata;23;370;11;4.660.387.338.164.440;Pending;19.076.657.339.590.700;Rail;Route B;5.174.999.739.290.600
skincare;SKU90;13.881.913.501.359.100;56;320;9.592.633.570.280.310;Non-binary;66;18;96;7;Carrier B;7.674.430.708.112.690;Supplier 3;Bangalore;8;585;8;8.567.596.333.579.790;Pass;12.193.822.244.013.800;Rail;Route B;9.900.784.725.058.110
cosmetics;SKU91;6.211.196.546.396.170;90;916;1.935.206.793.507.590;Male;98;22;85;7;Carrier B;7.471.514.084.401.140;Supplier 4;Delhi;5;207;28;39.772.882.502.339.900;Pending;0.6260018582093946;Rail;Route B;9.967.783.149.506.230
cosmetics;SKU92;4.771.423.307.582.020;44;276;21.001.297.546.259.300;Male;90;25;10;8;Carrier B;4.469.500.026.123.600;Supplier 2;Mumbai;4;671;29;62.612.690.395.614.300;Pass;0.33343182522473924;Rail;Route B;23.009.278.253.676.200
haircare;SKU93;6.929.083.100.290.540;88;114;45.314.021.336.919.000;Unknown;63;17;66;1;Carrier C;70.064.320.590.043.900;Supplier 4;Chennai;21;824;20;35.633.652.343.343.800;Fail;4.165.781.795.424.140;Air;Route A;8.235.238.458.881.550
cosmetics;SKU94;3.037.688.724.631.410;97;987;7.888.356.546.661.870;Unknown;77;26;72;9;Carrier B;6.942.945.942.032.580;Supplier 2;Delhi;12;908;14;6.038.737.861.486.210;Pass;14.636.074.984.727.700;Rail;Route B;8.466.652.569.866.940
haircare;SKU95;7.790.392.721.944.770;65;672;7.386.363.944.048.660;Unknown;15;14;26;9;Carrier B;8.630.338.869.602.750;Supplier 4;Mumbai;18;450;26;5.889.068.576.858.990;Pending;12.108.821.295.850.600;Air;Route A;7.788.642.413.766.470
cosmetics;SKU96;2.442.313.142.037.330;29;324;7.698.424.765.632.110;Non-binary;67;2;32;3;Carrier C;5.352.878.043.996.800;Supplier 3;Mumbai;28;648;28;1.780.375.633.139.120;Pending;3.872.047.681.482.130;Road;Route A;18.874.214.114.905.600
haircare;SKU97;3.526.111.259.143.410;56;62;4.370.916.579.984.530;Male;46;19;4;9;Carrier A;7.904.845.611.209.670;Supplier 4;Mumbai;10;535;13;6.576.515.592.636.740;Fail;3.376.237.834.717.980;Road;Route A;5.401.324.228.679.670
skincare;SKU98;197.546.048.668.786;43;913;8.525.952.559.683.520;Female;53;1;27;7;Carrier B;1.409.801.095.138.070;Supplier 5;Chennai;28;581;9;5.604.690.864.371.780;Pending;2.908.122.169.351.260;Rail;Route A;8.821.988.635.470.410
haircare;SKU99;6.851.783.269.927.660;17;627;9.185.185.829.181.700;Unknown;55;8;59;6;Carrier B;13.110.237.561.206.200;Supplier 2;Chennai;29;921;2;3.807.289.852.062.600;Fail;0.3460272907055034;Rail;Route B;21.074.300.896.424.600`;

// Cleaner that parses CSV values correctly
export function parseFormattedNumber(val: string): number {
  if (!val) return 0;
  // Strip spaces if any
  const cleaned = val.replace(/\s+/g, '').replace(/[^0-9.]/g, '');
  if (cleaned.startsWith('0.')) {
    return parseFloat(cleaned) || 0;
  }
  const parts = cleaned.split('.');
  if (parts.length > 1) {
    // Take first and second parts to represent standard floating point e.g. "6.98"
    const parsed = parseFloat(parts[0] + '.' + parts[1]);
    return isNaN(parsed) ? 0 : parsed;
  }
  return parseFloat(cleaned) || 0;
}

// Map Supplier raw names to custom professional indonesian supplier names from mockup
export const supplierNameMap: Record<string, { displayName: string; address: string; phone: string; phoneCode: string }> = {
  'Supplier 1': { displayName: 'PT. Indo Sarana', address: 'Jl. Gajah Mada No. 12, Surabaya', phone: '(031) 334-9981', phoneCode: 'IS' },
  'Supplier 2': { displayName: 'CV. Sinar Abadi', address: 'Kawasan Industri Jababeka, Bekasi', phone: '(021) 890-4432', phoneCode: 'SA' },
  'Supplier 3': { displayName: 'PT. Maju Jaya', address: 'Jl. Sudirman No. 45, Jakarta Pusat', phone: '(021) 555-0123', phoneCode: 'MJ' },
  'Supplier 4': { displayName: 'Global Tech Corp', address: 'Jl. Ahmad Yani No. 88, Bandung', phone: '(022) 776-2210', phoneCode: 'GT' },
  'Supplier 5': { displayName: 'PT. Abadi Sejahtera', address: 'Pergudangan Margomulyo Indah, Surabaya', phone: '(031) 544-2211', phoneCode: 'AS' },
};

// Main function to parse the CSV lines to clean Typed Objects
export function parseDataset(): DatasetRow[] {
  const rows: DatasetRow[] = [];
  const lines = rawCSV.trim().split('\n');
  
  for (const line of lines) {
    if (!line.trim()) continue;
    const cols = line.split(';');
    if (cols.length < 24) continue;
    
    // Parse each field
    const row: DatasetRow = {
      productType: cols[0],
      sku: cols[1],
      price: parseFormattedNumber(cols[2]),
      availability: parseFormattedNumber(cols[3]),
      productsSold: parseFormattedNumber(cols[4]),
      revenue: parseFormattedNumber(cols[5]),
      customerDemographics: cols[6],
      stockLevels: parseFormattedNumber(cols[7]),
      leadTimeDays: parseFormattedNumber(cols[8]),
      orderQuantities: parseFormattedNumber(cols[9]),
      shippingTimes: parseFormattedNumber(cols[10]),
      shippingCarrier: cols[11],
      shippingCosts: parseFormattedNumber(cols[12]),
      supplierName: cols[13],
      location: cols[14],
      leadTime: parseFormattedNumber(cols[15]),
      productionVolumes: parseFormattedNumber(cols[16]),
      mfgLeadTime: parseFormattedNumber(cols[17]),
      mfgCosts: parseFormattedNumber(cols[18]),
      inspectionResults: cols[19],
      defectRate: parseFormattedNumber(cols[20]),
      transportMode: cols[21],
      route: cols[22],
      costs: parseFormattedNumber(cols[23]),
    };
    rows.push(row);
  }
  
  return rows;
}

// Function to calculate summarized metrics grouped by Supplier
export function getSupplierMetrics(rows: DatasetRow[]): SupplierMetrics[] {
  const supplierGroups: Record<string, {
    prices: number[];
    defectRates: number[];
    leadTimes: number[];
    availabilities: number[];
    inspectionPasses: number[];
  }> = {};

  // Group raw rows
  for (const row of rows) {
    const sName = row.supplierName;
    if (!supplierGroups[sName]) {
      supplierGroups[sName] = {
        prices: [],
        defectRates: [],
        leadTimes: [],
        availabilities: [],
        inspectionPasses: []
      };
    }
    
    supplierGroups[sName].prices.push(row.price);
    
    // Handle defect rate normalizing to positive quality
    let defRate = row.defectRate;
    // Map percentages like 4.8 to decimal if needed, but keeping absolute comparisons
    if (defRate > 1) {
      defRate = defRate / 100;
    }
    supplierGroups[sName].defectRates.push(defRate);
    supplierGroups[sName].leadTimes.push(row.leadTime);
    supplierGroups[sName].availabilities.push(row.availability);
    
    // Inspection: Pass is 100 points, Pending is 70 points, Fail is 30 points
    const points = row.inspectionResults.toLowerCase() === 'pass' ? 1.0 
                  : row.inspectionResults.toLowerCase() === 'pending' ? 0.7 
                  : 0.3;
    supplierGroups[sName].inspectionPasses.push(points);
  }

  const list: SupplierMetrics[] = [];
  
  for (const [name, metrics] of Object.entries(supplierGroups)) {
    const avgPrice = metrics.prices.reduce((a, b) => a + b, 0) / metrics.prices.length;
    const avgDefect = metrics.defectRates.reduce((a, b) => a + b, 0) / metrics.defectRates.length;
    const avgLead = metrics.leadTimes.reduce((a, b) => a + b, 0) / metrics.leadTimes.length;
    const avgAvail = metrics.availabilities.reduce((a, b) => a + b, 0) / metrics.availabilities.length;
    const avgInspect = metrics.inspectionPasses.reduce((a, b) => a + b, 0) / metrics.inspectionPasses.length;
    
    // Quality combination: 50% from inspection rating, 50% from (1 - defectRate) * 100
    // Keep standard scale [0, 100]
    const quality = (avgInspect * 100 + (1 - avgDefect) * 100) / 2;
    const mapping = supplierNameMap[name] || {
      displayName: name,
      address: 'Unknown Address',
      phone: '(Unknown Number)',
      phoneCode: 'SP'
    };

    list.push({
      supplierName: name,
      displayName: mapping.displayName,
      address: mapping.address,
      phone: mapping.phone,
      phoneCode: mapping.phoneCode,
      price: parseFloat(avgPrice.toFixed(4)),
      defectRate: parseFloat(avgDefect.toFixed(4)),
      leadTime: parseFloat(avgLead.toFixed(4)),
      availability: parseFloat(avgAvail.toFixed(4)),
      inspectionPassRate: parseFloat((avgInspect * 100).toFixed(2)),
      qualityScore: parseFloat(quality.toFixed(4)),
      efficiencyScore: 0, // Computed dynamically 
    });
  }

  return list;
}
