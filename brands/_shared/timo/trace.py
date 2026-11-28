import sys,vtracer
vtracer.convert_image_to_svg_py(sys.argv[1],sys.argv[2],colormode='color',hierarchical='stacked',mode='spline',filter_speckle=6,color_precision=7,layer_difference=10,corner_threshold=60,length_threshold=4.0,splice_threshold=45,path_precision=2)
